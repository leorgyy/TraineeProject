using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Norbit.Crm.Leontev.NrbMaintenanceHelper
{
    /// <summary>
    /// Техническое обслуживание.
    /// </summary>
    public class NrbMaintenance
    {
        /// <summary>
        /// Дата обслуживания.
        /// </summary>
        public DateTime NrbMaintenanceDate { get; set; }

        /// <summary>
        /// Мастер ТО.
        /// </summary>
        public Guid NrbMaintenanceMaster { get; set; }

        /// <summary>
        /// Заключение.
        /// </summary>
        public string NrbMaintenanceConclusion { get; set; }

        /// <summary>
        /// Цена ТО.
        /// </summary>
        public double NrbMaintenancePrice {  get; set; }
    }
}
