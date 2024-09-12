define("NrbCarSection", [], function() {
	return {
		entitySchemaName: "NrbCar",
		messages: {
			/**
			 * Автомобиль изменён.
			 */
			"CarUpdated": {
				mode: BPMSoft.MessageMode.BROADCAST,
				direction: BPMSoft.MessageDirectionType.SUBSCRIBE,
			},

			/**
			 * Кнопка показана.
			 */
			"ButtonShown": {
				mode: BPMSoft.MessageMode.PTP,
				direction: BPMSoft.MessageDirectionType.SUBSCRIBE,
			},

			/**
			 * Машина скопирована.
			 */
			"CarCopied": {
				mode: BPMSoft.MessageMode.BROADCAST,
				direction: BPMSoft.MessageDirectionType.SUBSCRIBE,
			},
		},
		attributes: {
			/**
			 * Видимость новой кнопки.
			 */
			"IsVisiblePageButton": {
				"dataValueType": BPMSoft.DataValueType.BOOLEAN,
				"value": false
			},
		},
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"parentName": "SeparateModeActionButtonsLeftContainer",
				"propertyName": "items",
				"name": "NrbSectionButton",
				"values": {
					"itemType": BPMSoft.ViewItemType.BUTTON,
					"caption": {
						"bindTo": "Resources.Strings.SectionButtonCaption"
					},
					"click": { "bindTo": "onClickSectionButton" },
					"layout": {
						"column": 1,
						"row": 6,
						"colSpan": 1
					}
				}
			},
			{
				"operation": "insert",
				"parentName": "CombinedModeActionButtonsCardRightContainer",
				"propertyName": "items",
				"name": "NrbPageButton",
				"values": {
					"caption": {"bindTo": "Resources.Strings.HiddenButtonCaption"},
					"style": BPMSoft.controls.ButtonEnums.style.DEFAULT,
					"itemType": BPMSoft.ViewItemType.BUTTON,
					"click": {"bindTo": "onCardAction"},
					"visible": {"bindTo": "IsVisiblePageButton"},
					"tag": "onClickPageButton"
				}
			},
			{
				"operation": "insert",
				"parentName": "CombinedModeActionButtonsCardRightContainer",
				"propertyName": "items",
				"name": "NrbMostPowerfulCarButton",
				"values": {
					"caption": {"bindTo": "Resources.Strings.NrbMostPowerfulCarButtonCaption"},
					"style": BPMSoft.controls.ButtonEnums.style.DEFAULT,
					"itemType": BPMSoft.ViewItemType.BUTTON,
					"click": {"bindTo": "onCardAction"},
					"tag": "getMostPowerfulCar",
					"visible": true
				}
			},
			{
				"operation": "insert",
				"parentName": "CombinedModeActionButtonsCardLeftContainer",
				"propertyName": "items",
				"name": "NrbCarCopyServiceButton",
				"values": {
					"caption": {"bindTo": "Resources.Strings.NrbCarCopyServiceButtonCaption"},
					"style": BPMSoft.controls.ButtonEnums.style.DEFAULT,
					"itemType": BPMSoft.ViewItemType.BUTTON,
					"click": {"bindTo": "onCardAction"},
					"visible": true,
					"tag": "onClickNrbCarCopyServiceHandler"
				}
			},
		]/**SCHEMA_DIFF*/,
		methods: {
			/**
			 * Инициализация сообщений.
			 */
			init: function() {
				this.callParent(arguments);

				this.sandbox.subscribe("CarUpdated", this.onCarUpdated, this);
				this.sandbox.subscribe("ButtonShown", this.onButtonShown, this);
				this.sandbox.subscribe("CarCopied", this.onCarCopied, this);
			},

			/**
			 * Действие при изменении машины.
			 * @param {[carName: string]} args
			 */
			onCarUpdated: function(args) {
				this.showCarMessage(args[0], this.get("Resources.Strings.UpdatedCarMessage"));
			},

			/**
			 * Действие при показе скрытой кнопки.
			 * @param {[buttonName: string]} args
			 */
			onButtonShown: function(args) {
				this.showCarMessage(args[0], this.get("Resources.Strings.ButtonShownMessage"));
			},

			/**
			 * Действие при копировании машины.
			 * @param {[carName: string]} args
			 */
			onCarCopied: function(args) {
				this.showCarMessage(args[0], this.get("Resources.Strings.CopyMessageResultSuccess"));
			},

			/**
			 * Показ сообщения с параметром.
			 * @param {string} param Параметр сообщения.
			 * @param {string} message Сообщение.
			 */
			showCarMessage: function(param, message) {
				BPMSoft.showInformation(
					Ext.String.format(message, param)
				);
			},

			/**
			 * Добавление нового действия в панель.
			 * @returns Коллекция действий страницы редактирования.
			 */
			getSectionActions: function() {
				let actionMenuItems = this.callParent(arguments);

				actionMenuItems.addItem(this.getActionsMenuItem({
					Type: "BPMSoft.MenuSeparator",
					Caption: ""
				}));

				actionMenuItems.addItem(this.getButtonMenuItem({
					"Caption": { 
						"bindTo": "Resources.Strings.ModalWindowActionsCaption"
					},
					"Click": {"bindTo": "showModalWindow"},
				}));

				actionMenuItems.addItem(this.getButtonMenuItem({
					"Caption": {
						"bindTo": "Resources.Strings.RenameButtonCaption"
					},
					"Click": {"bindTo": "renameSelectRecordName"},
				}));
				
				return actionMenuItems;
			},

			/**
			 * Обработка нажатия кнопки секции.
			 */
			onClickSectionButton: function() {
				this.showModalWindow();
			},

			/**
			 * Показ модального окна. 
			 */
			showModalWindow: function() {								
				let redButton = {
					className: "BPMSoft.Button",
					style: BPMSoft.controls.ButtonEnums.style.RED,
					caption: this.get("Resources.Strings.ViewItemInfoButtonCaption"),
					returnCode: "redButton"
				};
				
				let orangeButton = {
					className: "BPMSoft.Button",
					style: BPMSoft.controls.ButtonEnums.style.ORANGE,
					caption: this.get("Resources.Strings.RenameButtonCaption"),
					returnCode: "orangeButton"
				};
				
				BPMSoft.utils.inputBox(
					this.get("Resources.Strings.ModalWindowActionsCaption"),
					function(result) {
						if (result === redButton.returnCode) {
							this.showSelectRecordAndName();
						}

						if (result === orangeButton.returnCode) {
							this.renameSelectRecordName();
						}
					},
					[redButton, orangeButton],
				this);
			},

			/**
			 * Выводит имя активной записи и имя контакта текущего пользователя.
			 */
			showSelectRecordAndName: function() {
				let activeRow = this.getActiveRow();

				if (this.Ext.isEmpty(activeRow)) {
					throw new Error(this.get("InactiveRowsErrorMessage"));
				}

				let controls = {
					recordName: {
						dataValueType: BPMSoft.DataValueType.TEXT,
						caption: this.get("Resources.Strings.RecordNameCaption"),
						value: activeRow.values.NrbName,
						customConfig: {
							enabled: false
						}
					},
					markName: {
						dataValueType: BPMSoft.DataValueType.TEXT,
						caption: this.get("Resources.Strings.MarkNameCaption"),
						value: activeRow.values.NrbMark,
						customConfig: {
							enabled: false
						}
					}
				};
				
				this.showInputBox(
					this.get("Resources.Strings.ViewItemInfoButtonCaption"), 
					function() {}, 
					controls);
			},

			/**
			 * Изменяет имена выбранных записей на введенное.
			 */
			renameSelectRecordName: function() {
				let selectedItems = this.getSelectedItems();

				let controls = {
					recordName: {
						dataValueType: BPMSoft.DataValueType.TEXT,
						caption: this.get("Resources.Strings.RenameRecordNameCaption"),
						value: "",
						customConfig: {
							focused: true
						}
					}
				};

				/**
				 * Обработка нажатия на кнопку - изменение имен выбранных записей.
				 */
				let functionButton = function() {

					if (selectedItems.length <= 0) {
						throw new Error(this.get("Resources.Strings.InactiveRowsErrorMessage"));
					}
					
					if (this.Ext.isEmpty(controls.recordName.value)) {
						throw new Error(this.get("Resources.Strings.EmptyNameErrorMessage"));
					}

					let updateQuery = this.Ext.create("BPMSoft.UpdateQuery", {
						rootSchemaName: "NrbCar"
					});
					
					updateQuery.setParameterValue("NrbName", controls.recordName.value, this.BPMSoft.DataValueType.TEXT);
					updateQuery.filters.add("NeedToUpdate", this.BPMSoft.createColumnInFilterWithParameters("Id", selectedItems));

					updateQuery.execute(result => {
						if (!result.success) {
							throw new Error(this.get("Resources.Strings.UpdateRowsErrorMessage"));
						}

						BPMSoft.showInformation(this.get("Resources.Strings.UpdateRowsSuccessMessage"));
						
						this.reloadGridData();
						
					}, this);
				};
				
				this.showInputBox(
					this.get("Resources.Strings.RenameButtonCaption"), 
					functionButton, 
					controls);
			},

			/**
			 * Выводит на экран модальное окно с заданными параметрами.
			 * @param {String} caption Заголовок.
			 * @param {Function} functionButton Обработка нажатия на кнопку ОК.
			 * @param {Object} controls Наполнение окна.
			 */
			showInputBox: function(caption, functionButton, controls) {
				BPMSoft.utils.inputBox(
					caption,
					functionButton,
					[BPMSoft.MessageBoxButtons.OK.returnCode],
				this, controls);
			}
		}
	};
});