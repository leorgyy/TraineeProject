define("NrbCarReplacedPartDetail", ["ConfigurationGrid", "ConfigurationGridGenerator",
	"ConfigurationGridUtilitiesV2"], function() {
	return {
		entitySchemaName: "NrbCarReplacedPart",
		attributes: {
			"IsEditable": {
				dataValueType: BPMSoft.DataValueType.BOOLEAN,
				type: BPMSoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: true
			}
		},
		mixins: {
			ConfigurationGridUtilitiesV2: "BPMSoft.ConfigurationGridUtilitiesV2"
		},
		methods: {
			onActiveRowAction: function(buttonTag, primaryColumnValue) {
				this.mixins.ConfigurationGridUtilitiesV2.onActiveRowAction.call(this, buttonTag, primaryColumnValue);
			},

			/**
			 * Сокрытие кнопки удаления.
			 */
			getDeleteRecordMenuItem: BPMSoft.emptyFn,

			/**
			 * Загрузка данных на странице.
			 */
			onGridDataLoaded: function() {
				this.callParent(arguments);
				this.colorizeGridData();
			},

			/**
			 * Меняет цвет строк в реестре детали.
			 */
			colorizeGridData: function() {
				let gridData = this.getGridData();
          		let loadedObject = {};
				const defaultColor = "NrbCarReplacedPartRowsColor";

           		BPMSoft.SysSettings.querySysSettingsItem(defaultColor, function (color) {
					gridData.each(function(item) {
						item.customStyle = {
							'background-color' : color || "white"
						};

						let primaryValue = item.get(item.primaryColumnName);
						loadedObject[primaryValue] = item;
					})
				}, this);

				gridData.clear();
				gridData.loadAll(loadedObject);
			}
		},
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "merge",
				"name": "DataGrid",
				"values": {
					"className": "BPMSoft.ConfigurationGrid",
					"generator": "ConfigurationGridGenerator.generatePartial",
					"generateControlsConfig": {"bindTo": "generateActiveRowControlsConfig"},
					"changeRow": {"bindTo": "changeRow"},
					"unSelectRow": {"bindTo": "unSelectRow"},
					"onGridClick": {"bindTo": "onGridClick"},
					"activeRowActions": [
						{
							"className": "BPMSoft.Button",
							"style": this.BPMSoft.controls.ButtonEnums.style.TRANSPARENT,
							"tag": "save",
							"markerValue": "save",
							"imageConfig": {"bindTo": "Resources.Images.SaveIcon"}
						},
						{
							"className": "BPMSoft.Button",
							"style": this.BPMSoft.controls.ButtonEnums.style.TRANSPARENT,
							"tag": "cancel",
							"markerValue": "cancel",
							"imageConfig": {"bindTo": "Resources.Images.CancelIcon"}
						},
						{
							"className": "BPMSoft.Button",
							"style": this.BPMSoft.controls.ButtonEnums.style.TRANSPARENT,
							"tag": "card",
							"markerValue": "card",
							"imageConfig": {"bindTo": "Resources.Images.CardIcon"}
						},
						{
							"className": "BPMSoft.Button",
							"style": BPMSoft.controls.ButtonEnums.style.TRANSPARENT,
							"tag": "copy",
							"markerValue": "copy",
							"imageConfig": {"bindTo": "Resources.Images.CopyIcon"}
						},
					],
					"initActiveRowKeyMap": {"bindTo": "initActiveRowKeyMap"},
					"activeRowAction": {"bindTo": "onActiveRowAction"},
					"multiSelect": {"bindTo": "MultiSelect"}
				}
			}
		]/**SCHEMA_DIFF*/
	};
});