/*jshint esversion:6*/
define("NrbCarPage", ["BusinessRuleModule", "NrbCarConst", "ServiceHelper"], function(BusinessRuleModule, NrbCarConst, ServiceHelper) {
	return {
		entitySchemaName: "NrbCar",
		messages: {
			/**
			 * Кнопка показана.
			 */
			"ButtonShown": {
				mode: BPMSoft.MessageMode.PTP,
				direction: BPMSoft.MessageDirectionType.PUBLISH,
			},

			/**
			 * Машина изменена.
			 */
			"CarUpdated": {
				mode: BPMSoft.MessageMode.BROADCAST,
				direction: BPMSoft.MessageDirectionType.PUBLISH,
			},

			/**
			 * Машина скопирована.
			 */
			"CarCopied": {
				mode: BPMSoft.MessageMode.BROADCAST,
				direction: BPMSoft.MessageDirectionType.PUBLISH,
			},
		},

		attributes: {
			/**
			 * Доступность даты покупки.
			 */
			"NrbPurchaseDateIsEnabled": {
				dataValueType: BPMSoft.DataValueType.BOOLEAN,
				type: BPMSoft.ViewModelColumnType.VIRTUAL_COLUMN,
				dependencies: [
					{
						columns: ["NrbPrice"],
						methodName: "changePurchaseDateAccess"
					}
				]
			},

			/**
			 * Новизна записи раздела.
			 */
			"IsNew": {
				dataValueType: BPMSoft.DataValueType.BOOLEAN,
				type: BPMSoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: false
			},

			/**
			 * Видимость новой кнопки.
			 */
			"IsVisiblePageButton": {
				"dataValueType": BPMSoft.DataValueType.BOOLEAN,
				"value": false
			},
		},
		rules: {
			"NrbCarClass": {
				/** 
				* Делает поле класса видимым, если присуствует тип авто.
				*/
				"VisibleIfHasCarType": {
					"ruleType": BusinessRuleModule.enums.RuleType.BINDPARAMETER,
					"property": BusinessRuleModule.enums.Property.VISIBLE,
					"conditions": [{
						"leftExpression": {
							"type": BusinessRuleModule.enums.ValueType.ATTRIBUTE,
							"attribute": "NrbCarType"
						},
						"comparisonType": BPMSoft.ComparisonType.IS_NOT_NULL,
					}]
				}
			}
		},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "NrbCarFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "NrbCar"
				}
			},
			"NrbCarMaintenanceDetail": {
				"schemaName": "NrbCarMaintenanceDetail",
				"entitySchemaName": "NrbCarMaintenance",
				"filter": {
					"detailColumn": "NrbCar",
					"masterColumn": "Id"
				}
			},
			"NrbCarReplacedPartDetail": {
				"schemaName": "NrbCarReplacedPartDetail",
				"entitySchemaName": "NrbCarReplacedPart",
				"filter": {
					"detailColumn": "NrbCar",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{
			"NrbMark": {
				"1b142e0f-dcd0-4cb5-b77d-50ac4c681455": {
					"uId": "1b142e0f-dcd0-4cb5-b77d-50ac4c681455",
					"enabled": true,
					"removed": true,
					"ruleType": 0,
					"property": 2,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 1,
							"leftExpression": {
								"type": 1,
								"attribute": "NrbName"
							}
						}
					]
				},
				"f7548395-f8c7-49be-8414-52e46f6916d4": {
					"uId": "f7548395-f8c7-49be-8414-52e46f6916d4",
					"enabled": true,
					"removed": false,
					"ruleType": 0,
					"property": 2,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 2,
							"leftExpression": {
								"type": 1,
								"attribute": "NrbName"
							}
						}
					]
				}
			},
			"NrbCarClass": {
				"VisibleIfHasCarMark": {
					"uId": "be36178d-cc1d-4b73-b75a-e4939c2ae32b",
					"enabled": true,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 2,
							"leftExpression": {
								"type": 1,
								"attribute": "NrbMark"
							}
						}
					],
					"removed": true
				}
			},
			"NrbOwner": {
				"7dd7be1b-707c-40aa-8d55-9117e11c6e9f": {
					"uId": "7dd7be1b-707c-40aa-8d55-9117e11c6e9f",
					"enabled": true,
					"removed": true,
					"ruleType": 1,
					"baseAttributePatch": "Age",
					"comparisonType": 8,
					"autoClean": false,
					"autocomplete": false,
					"type": 0,
					"value": 25,
					"dataValueType": 4
				},
				"f312a631-86c4-4cf3-b017-1fd5f447da66": {
					"uId": "f312a631-86c4-4cf3-b017-1fd5f447da66",
					"enabled": true,
					"removed": false,
					"ruleType": 1,
					"baseAttributePatch": "JobTitle",
					"comparisonType": 3,
					"autoClean": false,
					"autocomplete": false,
					"type": 0,
					"value": "Ассистент программиста",
					"dataValueType": 1
				}
			},
			"NrbCarMaintenanceDetail": {
				"262baebe-6b03-4f9a-b207-c2aabbd2efef": {
					"uId": "262baebe-6b03-4f9a-b207-c2aabbd2efef",
					"enabled": true,
					"removed": false,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 2,
							"leftExpression": {
								"type": 1,
								"attribute": "NrbOwner"
							}
						}
					]
				}
			}
		}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
			/**
			 * Обработка нажатия NrbCarCopyServiceButton.
			 */
			onClickNrbCarCopyServiceHandler: function() {
				const id = this.get("Id");

				ServiceHelper.callService({
					serviceName: "NrbCarCopyService",
					methodName: "CopyCar",
					data: {id},
					callback: this.getWebServiceResult,
					scope: this
				}, this);
			},

			/**
			 * Получение ответа от сервиса копирования записи.
			 * @param {Object} response Ответ.
			 * @param {Boolean} success Успешность выполнения сервиса.
			 */
			getWebServiceResult: function(response, success) {
				if (response.CopyCarResult.success) {
					this.sandbox.publish("CarCopied", [this.get("NrbName")]);
				} else {
					BPMSoft.showInformation(this.get("Resources.Strings.CopyMessageResultError"));
				}
			},

			/**
			 * Инициализирует методы.
			 */
			onEntityInitialized: function() {
				this.callParent(arguments);
				
				this.changePurchaseDateAccess();
			},

			/**
			 * Обработка изменений режимов работы.
			 */
			onOperationModeChange: function() {
				this.callParent(arguments);

				this.changePurchaseDateAccess();
			},

			/**
			 * Меняет доступ к дате покупки.
			 */
			changePurchaseDateAccess: function() {
				this.set("NrbPurchaseDateIsEnabled", !Ext.isEmpty(this.get("NrbPrice")));
			},

			/**
			 * Отменяет изменения.
			 */
			onDiscardChangesClick: function() {
				let parentMethod = this.getParentMethod();
				parentMethod.apply(this, [function() {
					this.changePurchaseDateAccess();
				}, this]);
			},

			/**
             * Действия перед сохранием записи.
             */
			save: function() {
				this.callParent(arguments);
				this.set("IsNew", this.isNew);
			},

			/**
			 * Действия при успешном сохранении.
			 */
			onSaved: function() {
				this.runMaintenanceWebService();

				this.callParent(arguments);

				this.sandbox.publish("CarUpdated", [this.get("NrbName")]);
			},

			/**
			 * Запуск действий с ТО.
			 */
			runMaintenanceActions: function() {
				const isNew = this.get("IsNew");
				const bound = NrbCarConst.MaintenanceCountBound;

				if (isNew) {
					this.addMaintenance();
				} else {
					this.getMaintenanceCount(function (maintenanceCount) {
						if (maintenanceCount < bound) {
							this.addMaintenance();
						} else if (maintenanceCount > bound) {
							this.keepLast();
						} else {
							this.getCarsCountWithMaintenanceCount(bound, function(carCount) {
								BPMSoft.showInformation(
									Ext.String.format(
										this.get("Resources.Strings.MaintenanceCountInfo"), 
										maintenanceCount, 
										carCount
									)
								);
							});
						}
					});
				}
			},

			/**
			 * Запуск веб-сервиса работы с ТО.
			 */
			runMaintenanceWebService: function() {
				var serviceData = {
					isNew: this.get("IsNew"),
					recordId: this.get("Id")
				}

				ServiceHelper.callService({
					serviceName: "NrbMaintenanceService",
					methodName: "UpdateCarRecord",
					callback: function(response) {
						if (response.UpdateCarRecordResult.OperationType === "GetRecordsCount") {
							this.showInformationDialog(
								Ext.String.format(
									this.get("Resources.Strings.MaintenanceCountInfo"),
									NrbCarConst.MaintenanceCountBound, 
									response.UpdateCarRecordResult.RecordCount
								)
							);
						}
					},
					data: serviceData,
					scope: this
				}, this)

			},

			/**
			 * Получение самой мощной машины.
			 */
			getMostPowerfulCar: function() {
				const carData = {
					"carType": NrbCarConst.OffRoadCar,
					"maxPower": NrbCarConst.MaxPower
				};

				ServiceHelper.callService({
					serviceName: "NrbMaintenanceService",
					methodName: "GetMostPowerfulCar",
					callback: function(response) {
						if (response.GetMostPowerfulCarResult.success) {
							return this.showInformationDialog(Ext.String.format(
								this.get("Resources.Strings.MostPowerfulCarMessageSuccess"),
								response.GetMostPowerfulCarResult.Name, 
								response.GetMostPowerfulCarResult.Power,
								response.GetMostPowerfulCarResult.Price
							));
						}
						return this.showInformationDialog(
							this.get("Resources.Strings.MostPowerfulCarMessageError"));
					},
					data: carData,
					scope: this
				}, this)
			},

			/**
			 * Добавляет запись ТО в деталь.
			 */
			addMaintenance: function() {
				const additionQuery = this.createQuery("InsertQuery", "NrbCarMaintenance");

				additionQuery.setParameterValue("NrbCar", this.get("Id"), this.BPMSoft.DataValueType.GUID);
				additionQuery.setParameterValue("NrbMaintenanceDate", NrbCarConst.MaintenanceDateDefault, this.BPMSoft.DataValueType.DATE_TIME);
				additionQuery.setParameterValue("NrbMaintenanceMaster", NrbCarConst.MaintenanceMasterDefault, this.BPMSoft.DataValueType.GUID);
				additionQuery.setParameterValue("NrbMaintenanceConclusion", NrbCarConst.MaintenanceConclusionDefault, this.BPMSoft.DataValueType.TEXT);
				additionQuery.setParameterValue("NrbMaintenancePrice", NrbCarConst.MaintenancePriceDefault, this.BPMSoft.DataValueType.FLOAT);

				additionQuery.execute(Ext.emptyFn, this);
			},

			/**
			 * Получает дату последнего добавления записи в деталь
			 * @param {(lastDate: Date) => void} callback 
			 */
			getLastAdditionDate: function(callback) {
				const lastDateColumn = "LastDate";
				const lastDateQuery = this.createQuery("EntitySchemaQuery", "NrbCarMaintenance");

				lastDateQuery.addAggregationSchemaColumn("CreatedOn", BPMSoft.AggregationType.MAX, lastDateColumn);
				this.filterByCarId(lastDateQuery);

				lastDateQuery.getEntityCollection(function(response) {
					if (response.success && !response.collection.isEmpty()) {
						const value = response.collection.getByIndex(0).get(lastDateColumn)

						Ext.callback(callback, this, [value]);
					}
				}, this);
			},

			/**
			 * Удаляет все записи из детали кроме последней.
			 * @param {Number} bound Граничное значение.
			 */
			keepLast: function() {
				const deleteQuery = this.createQuery("DeleteQuery", "NrbCarMaintenance");

				this.getLastAdditionDate(function(lastDate) {
					deleteQuery.filters.addItem(
						deleteQuery.createColumnFilterWithParameter(
							BPMSoft.ComparisonType.LESS, "CreatedOn", lastDate
						)
					);

					this.filterByCarId(deleteQuery);

					deleteQuery.execute(Ext.emptyFn, this);
				});
			},

			/**
			 * Получает количество машин с одинаковым количеством ТО.
			 * @param {Number} bound Граничное значение.
			 * @param {(carCount: Number) => void} callback 
			 */
			getCarsCountWithMaintenanceCount: function(bound, callback) {
				let esq = this.createQuery("EntitySchemaQuery", "NrbCarMaintenance")
				const countColumn = "Column";

				esq.addColumn("NrbCar.Id");
				esq.addAggregationSchemaColumn("Id", BPMSoft.AggregationType.COUNT, countColumn);
				
				esq.getEntityCollection(result => {
					let recordCount = result.collection.collection.length;
					
					result.collection.each(function (item) {
						if (item.values[countColumn] !== bound) {
								recordCount--;
						}
					});

					if (result.success && !result.collection.isEmpty()) {
						Ext.callback(callback, this, [recordCount]);
					}
				});
			},

			/**
			 * Получает количество ТО для данного авто.
			 * @param {(carCount: Number) => void} callback
			 */
			getMaintenanceCount: function(callback) {
				const maintenanceCountQuery = this.createQuery("EntitySchemaQuery", "NrbCarMaintenance");
				const countColumn = "countColumn";

				maintenanceCountQuery.addAggregationSchemaColumn("Id", BPMSoft.AggregationType.COUNT, countColumn);
				this.filterByCarId(maintenanceCountQuery);

				maintenanceCountQuery.getEntityCollection(function(response) {
					if(response.success && !response.collection.isEmpty()) {
						const value = response.collection.getByIndex(0).get(countColumn)

						Ext.callback(callback, this, [value]);
					}
				}, this);
			},

			/**
			 * Фильтр по CarId.
			 * @param {object} query Объект запроса.
			 */
			filterByCarId: function(query) {
				query.filters.addItem(
					BPMSoft.createColumnFilterWithParameter(
						BPMSoft.ComparisonType.EQUAL, "NrbCar", this.get("Id")
					)
				);
			},

			/**
			 * Создает объект запроса.
			 * @param {string} query Имя объекта запроса.
			 * @param {string} schema Название схемы. 
			 * @returns Объект запроса таблицы.
			 */
			createQuery: function(query, schema) {
				return Ext.create(Ext.String.format("BPMSoft.{0}", query), {
					rootSchemaName: schema
				});
			},

			/**
			 * Возвращает коллекцию действий.
			 * @returns Коллекция действий.
			 */
			getActions: function() {
				let actionMenuItems = this.callParent(arguments);
				
				actionMenuItems.addItem(this.getActionsMenuItem({
					Type: "BPMSoft.MenuSeparator",
					Caption: ""
				}));
				
				actionMenuItems.addItem(this.getActionsMenuItem({
					"Caption": this.get("Resources.Strings.ActionHiddenButtonCaption"),
					"Tag": "callCustomProcess"
				}));

				return actionMenuItems;
			},

			/**
			 * Обработка нажатия кнопки.
			 */
			onClickPageButton: function() {
				this.set("IsVisiblePageButton", false);
				this.publishPropertyValueToSection("IsVisiblePageButton", false);
			},
			
			/**
			 * Обработка нажатия действия.
			 */
			callCustomProcess: function() {
				this.set("IsVisiblePageButton", true);
				this.publishPropertyValueToSection("IsVisiblePageButton", true);

				this.sandbox.publish(
					"ButtonShown", 
					[this.get("Resources.Strings.HiddenButtonCaption")]
				);
			}
		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"parentName": "RightContainer",
				"propertyName": "items",
				"name": "NrbPageButton",
				"values": {
					"caption": {"bindTo": "Resources.Strings.HiddenButtonCaption"},
					"style": BPMSoft.controls.ButtonEnums.style.DEFAULT,
					"itemType": BPMSoft.ViewItemType.BUTTON,
					"click": {"bindTo": "onClickPageButton"},
					"visible": {"bindTo": "IsVisiblePageButton"}
				}
			},
			{
				"operation": "insert",
				"parentName": "LeftContainer",
				"propertyName": "items",
				"name": "NrbCarCopyServiceButton",
				"values": {
					"caption": {"bindTo": "Resources.Strings.NrbCarCopyServiceButtonCaption"},
					"style": BPMSoft.controls.ButtonEnums.style.DEFAULT,
					"itemType": BPMSoft.ViewItemType.BUTTON,
					"click": {"bindTo": "onClickNrbCarCopyServiceHandler"},
					"visible": true
				}
			},
			{
				"operation": "insert",
				"parentName": "RightContainer",
				"propertyName": "items",
				"name": "NrbMostPowerfulCarButton",
				"values": {
					"caption": {"bindTo": "Resources.Strings.NrbMostPowerfulCarButtonCaption"},
					"style": BPMSoft.controls.ButtonEnums.style.DEFAULT,
					"itemType": BPMSoft.ViewItemType.BUTTON,
					"click": {"bindTo": "getMostPowerfulCar"},
					"visible": true
				}
			},
			{
				"operation": "insert",
				"name": "NrbName",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "NrbName"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NrbMark",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "NrbMark",
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NrbPrice",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 11,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "NrbPrice",
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "NrbCarType",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "NrbCarType",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "NrbPurchaseDate",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 11,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "NrbPurchaseDate",
					"enabled": {
						"bindTo": "NrbPurchaseDateIsEnabled"
					}
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "NrbPower",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "Header"
					},
					"bindTo": "NrbPower",
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "NrbOwner",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "Header"
					},
					"bindTo": "NrbOwner",
					"enabled": true,
					"contentType": 5
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "CommonInfo",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.CommonInfoTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "CommonInfoGroup",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.CommonInfoGroupGroupCaption"
					},
					"itemType": 15,
					"markerValue": "added-group",
					"items": []
				},
				"parentName": "CommonInfo",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "CommonInfoGridLayout",
				"values": {
					"itemType": 0,
					"items": []
				},
				"parentName": "CommonInfoGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "CommonInfoNrbName",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "CommonInfoGridLayout"
					},
					"bindTo": "NrbName"
				},
				"parentName": "CommonInfoGridLayout",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "CommonInfoNrbMarkCountry",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 12,
						"row": 0,
						"layoutName": "CommonInfoGridLayout"
					},
					"bindTo": "NrbMarkCountry",
					"enabled": true
				},
				"parentName": "CommonInfoGridLayout",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "CommonInfoNrbMark",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "CommonInfoGridLayout"
					},
					"bindTo": "NrbMark"
				},
				"parentName": "CommonInfoGridLayout",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "CommonInfoNrbCarClass",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 12,
						"row": 1,
						"layoutName": "CommonInfoGridLayout"
					},
					"bindTo": "NrbCarClass",
					"enabled": true
				},
				"parentName": "CommonInfoGridLayout",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "CommonInfoNrbCarType",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "CommonInfoGridLayout"
					},
					"bindTo": "NrbCarType"
				},
				"parentName": "CommonInfoGridLayout",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "CommonInfoNrbOwner",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "CommonInfoGridLayout"
					},
					"bindTo": "NrbOwner"
				},
				"parentName": "CommonInfoGridLayout",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "NrbCarMaintenanceDetail",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "CommonInfo",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "TechInfo",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.TechInfoTabCaption"
					},
					"items": [],
					"order": 1
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "TechInfoGroup",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.TechInfoGroupGroupCaption"
					},
					"itemType": 15,
					"markerValue": "added-group",
					"items": []
				},
				"parentName": "TechInfo",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "TechInfoGridLayout",
				"values": {
					"itemType": 0,
					"items": []
				},
				"parentName": "TechInfoGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "TechInfoNrbAcceleration",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "TechInfoGridLayout"
					},
					"bindTo": "NrbAcceleration",
					"enabled": true
				},
				"parentName": "TechInfoGridLayout",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "TechInfoNrbEngineCapacity",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 12,
						"row": 0,
						"layoutName": "TechInfoGridLayout"
					},
					"bindTo": "NrbEngineCapacity",
					"enabled": true
				},
				"parentName": "TechInfoGridLayout",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "TechInfoNrbExpenditure",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "TechInfoGridLayout"
					},
					"bindTo": "NrbExpenditure",
					"enabled": true
				},
				"parentName": "TechInfoGridLayout",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "TechInfoNrbPower",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 12,
						"row": 1,
						"layoutName": "TechInfoGridLayout"
					},
					"bindTo": "NrbPower",
					"enabled": true
				},
				"parentName": "TechInfoGridLayout",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "NrbCarReplacedPartDetail",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "TechInfo",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "ChangeInfo",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.ChangeInfoTabCaption"
					},
					"items": [],
					"order": 2
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "ChangeInfoGroup",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.ChangeInfoGroupGroupCaption"
					},
					"itemType": 15,
					"markerValue": "added-group",
					"items": []
				},
				"parentName": "ChangeInfo",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ChangeInfoGridLayout",
				"values": {
					"itemType": 0,
					"items": []
				},
				"parentName": "ChangeInfoGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ChangeInfoCreatedOn",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ChangeInfoGridLayout"
					},
					"bindTo": "CreatedOn"
				},
				"parentName": "ChangeInfoGridLayout",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ChangeInfoCreatedBy",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 13,
						"row": 0,
						"layoutName": "ChangeInfoGridLayout"
					},
					"bindTo": "CreatedBy"
				},
				"parentName": "ChangeInfoGridLayout",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "ChangeInfoModifiedOn",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "ChangeInfoGridLayout"
					},
					"bindTo": "ModifiedOn"
				},
				"parentName": "ChangeInfoGridLayout",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "ChangeInfoModifiedBy",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 13,
						"row": 1,
						"layoutName": "ChangeInfoGridLayout"
					},
					"bindTo": "ModifiedBy"
				},
				"parentName": "ChangeInfoGridLayout",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "NotesAndFilesTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.NotesAndFilesTabCaption"
					},
					"items": [],
					"order": 3
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "Files",
				"values": {
					"itemType": 2
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesControlGroup",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.NotesGroupCaption"
					},
					"items": []
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Notes",
				"values": {
					"bindTo": "NrbNotes",
					"dataValueType": 1,
					"contentType": 4,
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 24
					},
					"labelConfig": {
						"visible": false
					},
					"controlConfig": {
						"imageLoaded": {
							"bindTo": "insertImagesToNotes"
						},
						"images": {
							"bindTo": "NotesImagesCollection"
						}
					}
				},
				"parentName": "NotesControlGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 4
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
