using BPMSoft.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NrbValidationHelper;
using NrbConstant;
using BPMSoft.Core.Entities;
using BPMSoft.Common;

namespace Norbit.Crm.Leontev.NrbMaintenanceHelper
{
	/// <summary>
	/// Менеджер записей ТО.
	/// </summary>
	public class MaintenanceRecordManager
	{
		/// <summary>
		/// Строка подключения.
		/// </summary>
		private UserConnection _userConnection;

		/// <summary>
		/// Количетсво строк по умолчанию.
		/// </summary>
		private static readonly int DefaultRowsCount = 3;

		/// <summary>
		/// Создает объект класса со сктрокой подключения.
		/// </summary>
		/// <param name="userConnection"></param>
		public MaintenanceRecordManager(UserConnection userConnection)
		{
			ValidationHelper.CheckNullValue(userConnection);
			_userConnection = userConnection;
		}

		/// <summary>
		/// Сохраняет новую запись ТО.
		/// </summary>
		/// <param name="id">Id записи.</param>
		/// <returns>Результат операции.</returns>
		public MaintenanceOperationResponse SaveNewMaintenanceRecord(Guid id)
		{
			ValidationHelper.CheckEmptyGuid(id);

			var maintenance = new NrbMaintenance()
			{
				NrbMaintenanceDate = MaintenanceConstant.NrbMaintenanceDateDefault,
				NrbMaintenanceMaster = MaintenanceConstant.NrbMaintenanceMasterDefault,
				NrbMaintenanceConclusion = MaintenanceConstant.NrbMaintenanceConclusionDefault,
				NrbMaintenancePrice = MaintenanceConstant.NrbMaintenancePriceDefault
			};

			return new MaintenanceOperationResponse("Add", AddMaintenanceRecord(id, maintenance));
		}

		/// <summary>
		/// Обновление записей ТО.
		/// </summary>
		/// <param name="carRecordId">Id записи машины.</param>
		/// <returns>Результат операции.</returns>
		public MaintenanceOperationResponse UpdateMaintenanceRecords(Guid carRecordId)
		{
			ValidationHelper.CheckEmptyGuid(carRecordId);

			var schema = new EntitySchemaQuery(_userConnection.EntitySchemaManager, MaintenanceConstant.NrbMaintenance);

			schema.AddColumn("Id");
			schema.AddColumn("NrbCar.Id");

			schema.Filters.Add(schema.CreateFilterWithParameters(
				FilterComparisonType.Equal,
				"NrbCar",
				carRecordId
			));

			var entities = schema.GetEntityCollection(_userConnection);

			if (entities.Count < DefaultRowsCount)
			{
				return SaveNewMaintenanceRecord(carRecordId);
			}
			else if (entities.Count == DefaultRowsCount)
			{
				return new MaintenanceOperationResponse("GetRecordsCount", true, GetRecordsCount());
			}
			else
			{
				return new MaintenanceOperationResponse("Delete", DeleteMaintenanceRecord(carRecordId));
			}
		}

		/// <summary>
		/// Удаление записей ТО.
		/// </summary>
		/// <param name="recordId">Id записи</param>
		/// <returns>Результат операции</returns>
		public bool DeleteMaintenanceRecord(Guid recordId)
		{
			ValidationHelper.CheckEmptyGuid(recordId);

			var result = true;

			var deleteSchema = new EntitySchemaQuery(_userConnection.EntitySchemaManager, MaintenanceConstant.NrbMaintenance);
			
			deleteSchema.AddAllSchemaColumns();

			deleteSchema.Filters.Add(deleteSchema.CreateFilterWithParameters(
				FilterComparisonType.Equal,
				"NrbCar",
				recordId));

			var entities = deleteSchema.GetEntityCollection(_userConnection);

			ValidationHelper.CheckBoundValue(entities.Count, 0);

			while (entities.Count > 1)
			{
				result &= entities.FirstOrDefault().Delete();
			}

			return result;
		}

		/// <summary>
		/// Добавление записи ТО.
		/// </summary>
		/// <param name="recordId">Id записи.</param>
		/// <param name="maintenance">Параметры записи ТО.</param>
		/// <returns>Результат операции.</returns>
		public bool AddMaintenanceRecord(Guid recordId, NrbMaintenance maintenance)
		{
			ValidationHelper.CheckNullValue(maintenance);
			ValidationHelper.CheckEmptyGuid(recordId);

			var addSchema = _userConnection.EntitySchemaManager.GetInstanceByName(MaintenanceConstant.NrbMaintenance);
			var entity = addSchema.CreateEntity(_userConnection);

			entity.SetColumnValue("Id", Guid.NewGuid());
			entity.SetColumnValue(MaintenanceConstant.NrbMaintenanceDate, maintenance.NrbMaintenanceDate);
			entity.SetColumnValue(MaintenanceConstant.NrbMaintenanceMaster, maintenance.NrbMaintenanceMaster);
			entity.SetColumnValue(MaintenanceConstant.NrbMaintenanceConclusion, maintenance.NrbMaintenanceConclusion);
			entity.SetColumnValue(MaintenanceConstant.NrbMaintenancePrice, maintenance.NrbMaintenancePrice);
			entity.SetColumnValue(MaintenanceConstant.NrbCarId, recordId);

			return entity.Save(false, true);
		}

		/// <summary>
		/// Получение машин с одинаковыми записями ТО.
		/// </summary>
		/// <returns></returns>
		public int GetRecordsCount()
		{
			var schema = new EntitySchemaQuery(_userConnection.EntitySchemaManager, MaintenanceConstant.NrbMaintenance);
			var recordsCount = 0;

			var id = schema.AddColumn(schema.CreateAggregationFunction(AggregationTypeStrict.Count, "Id"));
			schema.AddColumn("NrbCar.Id");

			var entities = schema.GetEntityCollection(_userConnection);

			ValidationHelper.CheckBoundValue(entities.Count, 0);

			foreach (var entity in entities)
			{
				if ((int)entity.GetColumnValue(id.Name) == DefaultRowsCount)
				{
					recordsCount++;
				}
			}

			return recordsCount;
		}
	}
}
