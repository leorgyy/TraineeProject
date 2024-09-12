define("NrbCarConst", [], function() {
	/**
	 * Дата по умолчанию.
	 */
	const maintenanceDateDefault = new Date();

	/**
	 * Мастер по умолчанию.
	 */
	const maintenanceMasterDefault = "B1EC5E0E-D520-4C81-80CF-448963DA00B9";

	/**
	 * Результат по умолчанию.
	 */
	const maintenanceConclusionDefault = "Машина полностью исправна";

	/**
	 * Цена по умолчанию.
	 */
	const maintenancePriceDefault = 1000;

	/**
	 * Граничное количество ТО.
	 */
	const maintenanceCountBound = 3;

	/**
	 * Тип машины внедорожник.
	 */
	const offRoadCar = "8A35EFF9-6A2C-48A4-AA29-6187172AE1C1";

	/**
	 * Максимальная мощность.
	 */
	const maxPower = 340;

	return {
		MaintenanceDateDefault: maintenanceDateDefault,
		MaintenanceMasterDefault: maintenanceMasterDefault,
		MaintenanceConclusionDefault: maintenanceConclusionDefault,
		MaintenancePriceDefault: maintenancePriceDefault,
		MaintenanceCountBound: maintenanceCountBound,
		OffRoadCar: offRoadCar,
		MaxPower: maxPower
	}
});