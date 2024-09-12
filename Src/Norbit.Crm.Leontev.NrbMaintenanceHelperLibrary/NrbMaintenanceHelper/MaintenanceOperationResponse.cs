using BPMSoft.Core.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NrbValidationHelper;

namespace Norbit.Crm.Leontev.NrbMaintenanceHelper
{
	/// <summary>
	/// Хелпер результата работы операций.
	/// </summary>
	public class MaintenanceOperationResponse
	{
		/// <summary>
		/// Тип операции.
		/// </summary>
		public string OperationType { get; private set; }

		/// <summary>
		/// Результат операции.
		/// </summary>
		public bool OperationResult { get; private set; }

		/// <summary>
		/// Количество записей.
		/// </summary>
		public int RecordCount {  get; private set; }

		/// <summary>
		/// Инициализация объекта класса с параметрами.
		/// </summary>
		/// <param name="operationType">Тип операции.</param>
		/// <param name="operationResult">Результат операции.</param>
		/// <param name="recordCount">Количество записец.</param>
		public MaintenanceOperationResponse(string operationType, bool operationResult, int recordCount = 0)
		{
			ValidationHelper.CheckEmptyString(operationType);
			ValidationHelper.CheckNullValue(operationResult);

			OperationType = operationType;
			OperationResult = operationResult;
			RecordCount = recordCount;
		}
	}
}
