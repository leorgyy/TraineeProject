using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BPMSoft.Common;
using BPMSoft.Core;
using BPMSoft.Core.DB;
using BPMSoft.Core.Entities;
using NrbValidationHelper;

namespace Norbit.Crm.Leontev.NrbCarHelper
{
	/// <summary>
	/// Хелпер копирования записей машин.
	/// </summary>
	public class CarCopyHelper
	{
		/// <summary>
		/// Подключение пользователя.
		/// </summary>
		private UserConnection _userConnection;

		/// <summary>
		/// Название таблицы NrbCar.
		/// </summary>
		private static readonly string NrbCarTable = "NrbCar";

		/// <summary>
		/// Название таблицы NrbCarReplacedPart.
		/// </summary>
		private static readonly string NrbCarReplacedPartTable = "NrbCarReplacedPart";

		/// <summary>
		/// Создает сервис копирования.
		/// </summary>
		/// <param name="userConnection">Подключение пользователя.</param>
		public CarCopyHelper(UserConnection userConnection)
		{
			ValidationHelper.CheckNullValue(userConnection);

			_userConnection = userConnection;
		}

		/// <summary>
		/// Копирует запись машины по id.
		/// </summary>
		/// <param name="id">id записи.</param>
		public void CopyCarRecord(Guid id)
		{
			ValidationHelper.CheckEmptyGuid(id);

			var esq = new EntitySchemaQuery(_userConnection.EntitySchemaManager, NrbCarTable);
			var newId = Guid.NewGuid();

			esq.AddColumn("NrbName");
			esq.AddColumn("NrbMark");
			esq.AddColumn("NrbCarType");
			esq.AddColumn("NrbPower");
			esq.AddColumn("NrbOwner");
			esq.AddColumn("NrbPrice");
			esq.AddColumn("NrbPurchaseDate");
			esq.AddColumn("NrbMarkCountry");

			var carToCopy = esq.GetEntity(_userConnection, id);

			var insert = new Insert(_userConnection)
				.Into(NrbCarTable)
				.Set("Id", Column.Parameter(newId))
				.Set("NrbName", Column.Parameter(carToCopy.GetColumnValue("NrbName")))
				.Set("NrbMark", Column.Parameter(carToCopy.GetColumnValue("NrbMark")))
				.Set("NrbCarTypeId", Column.Parameter(carToCopy.GetColumnValue("NrbCarTypeId")))
				.Set("NrbPower", Column.Parameter(carToCopy.GetColumnValue("NrbPower")))
				.Set("NrbMarkCountry", Column.Parameter(carToCopy.GetColumnValue("NrbMarkCountry")))
				.Set("NrbOwnerId", Column.Parameter(carToCopy.GetColumnValue("NrbOwnerId")))
				.Set("NrbPrice", Column.Parameter(carToCopy.GetColumnValue("NrbPrice")))
				.Set("NrbPurchaseDate", Column.Parameter(carToCopy.GetColumnValue("NrbPurchaseDate")));

			insert.Execute();

			CopyReplacedParts(id, newId);
		}

		/// <summary>
		/// Копирование детали.
		/// </summary>
		/// <param name="carId">Id записи машины.</param>
		/// <param name="newId">Новый Id</param>
		public void CopyReplacedParts(Guid carId, Guid newId) 
		{
			ValidationHelper.CheckEmptyGuid(carId);
			ValidationHelper.CheckEmptyGuid(newId);

			var esq = new EntitySchemaQuery(_userConnection.EntitySchemaManager, NrbCarReplacedPartTable);

			esq.AddColumn("NrbCarDetail");
			esq.AddColumn("NrbReplacementDate");
			esq.AddColumn("NrbTechMaster");
			esq.AddColumn("NrbReplacementResult");
			esq.AddColumn("NrbReplacementPrice");

			esq.Filters.Add(esq.CreateFilterWithParameters(
				FilterComparisonType.Equal,
				"NrbCar",
				carId));

			foreach(var replacedPart in esq.GetEntityCollection(_userConnection))
			{
				var insert = new Insert(_userConnection)
					.Into(NrbCarReplacedPartTable)
					.Set("NrbCarId", Column.Parameter(newId))
					.Set("NrbCarDetail", Column.Parameter(replacedPart.GetColumnValue("NrbCarDetail")))
					.Set("NrbReplacementDate", Column.Parameter(replacedPart.GetColumnValue("NrbReplacementDate")))
					.Set("NrbTechMasterId", Column.Parameter(replacedPart.GetColumnValue("NrbTechMasterId")))
					.Set("NrbReplacementResult", Column.Parameter(replacedPart.GetColumnValue("NrbReplacementResult")))
					.Set("NrbReplacementPrice", Column.Parameter(replacedPart.GetColumnValue("NrbReplacementPrice")));

				insert.Execute();
			}
		}
	}
}
