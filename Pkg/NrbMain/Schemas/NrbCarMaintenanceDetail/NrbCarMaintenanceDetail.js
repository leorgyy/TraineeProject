define("NrbCarMaintenanceDetail", [], function() {
	return {
		entitySchemaName: "NrbCarMaintenance",
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[]/**SCHEMA_DIFF*/,
		methods: {
			/**
			 * Сокрытие кнопки удаления.
			 */
			getDeleteRecordMenuItem: BPMSoft.emptyFn,
		}
	};
});
