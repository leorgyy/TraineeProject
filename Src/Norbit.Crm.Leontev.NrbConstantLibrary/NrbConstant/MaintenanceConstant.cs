using Microsoft.SqlServer.Server;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace NrbConstant
{
	/// <summary>
	/// Константы детали ТО.
	/// </summary>
	public static class MaintenanceConstant
	{
		/// <summary>
		/// Деталь.
		/// </summary>
		public static readonly string NrbMaintenance = "NrbCarMaintenance";

		/// <summary>
		/// Id.
		/// </summary>
		public static readonly string Id = "Id";

		/// <summary>
		/// Id ТО.
		/// </summary>
		public static readonly string NrbMaintenanceId = "MaintenanceId";

		/// <summary>
		/// Дата ТО.
		/// </summary>
		public static readonly string NrbMaintenanceDate = "NrbMaintenanceDate";

		/// <summary>
		/// Мастер ТО.
		/// </summary>
		public static readonly string NrbMaintenanceMaster = "NrbMaintenanceMasterId";

		/// <summary>
		/// Заключение ТО.
		/// </summary>
		public static readonly string NrbMaintenanceConclusion = "NrbMaintenanceConclusion";

		/// <summary>
		/// Цена ТО.
		/// </summary>
		public static readonly string NrbMaintenancePrice = "NrbMaintenancePrice";

		/// <summary>
		/// Id машины.
		/// </summary>
		public static readonly string NrbCarId = "NrbCarId";

		/// <summary>
		/// Дата по умолчанию.
		/// </summary>
		public static readonly DateTime NrbMaintenanceDateDefault = DateTime.Now;

		/// <summary>
		/// Мастер по умолчанию.
		/// </summary>
		public static readonly Guid NrbMaintenanceMasterDefault = new Guid("B1EC5E0E-D520-4C81-80CF-448963DA00B9");

		/// <summary>
		/// Результат по умолчанию.
		/// </summary>
		public static readonly string NrbMaintenanceConclusionDefault = "Машина полностью исправна";

		/// <summary>
		/// Цена по умолчанию.
		/// </summary>
		public static readonly double NrbMaintenancePriceDefault = 1000;
	}
}
