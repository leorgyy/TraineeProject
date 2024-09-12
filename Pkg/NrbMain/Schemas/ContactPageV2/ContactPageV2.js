define("ContactPageV2", [], function() {
	return {
		entitySchemaName: "Contact",
		messages: {
			/**
			 * Контакт был обновлен.
			 */
			"ContactUpdated": {
				mode: BPMSoft.MessageMode.BROADCAST,
				direction: BPMSoft.MessageDirectionType.SUBSCRIBE,
			},
		},
		methods: {
			/**
			 * Инициализация страницы редактирования.
			 */
			init: function() {
				this.callParent(arguments);

				this.sandbox.subscribe("ContactUpdated", this.onContactUpdated, this);
			},

			/**
			 * Действие при обновлении контакта извне.
			 * Обновляет данные на странице.
			 */
			onContactUpdated: function() {
				this.reloadEntity();
			},

			/**
			 * Добавление действий.
			 * @returns Действия на странице.
			 */
			getActions: function() {
				let actions = this.callParent(arguments);

				actions.addItem(this.getButtonMenuItem({
					"Click": {"bindTo": "displayCommunications"},
					"Caption": {
						"bindTo": "Resources.Strings.DisplayCommunicationsActionCaption"
					}
				}));

				actions.addItem(this.getButtonMenuItem({
					"Click": {"bindTo": "deleteCommunicationDialog"},
					"Caption": {
						"bindTo": "Resources.Strings.DeleteCommunicationDialogActionCaption"
					}
				}));

				return actions;
			},

			/**
			 * Отображение списка коммуникаций.
			 */
			displayCommunications: function() {
				this.getCommunicationsList(
					function(value) {
						const communications = value.map(item => item.Number);

						BPMSoft.showInformation(communications.join("\n"));
					},
				);
			},

			/**
			 * Получение списка коммуникаций.
			 * @param {(value: { Id: string, Number: string }[]) => void} callback  
			 */
			getCommunicationsList: function(callback) {
				let contactId = this.get("Id");

				let url = this.get("Resources.Strings.URL");

				let requestUrl = url + 
					Ext.String.format(
						this.get("Resources.Strings.GetCommunicationsListUrl"),
						contactId
					);
				
				BPMSoft.AjaxProvider.request({
					url: requestUrl,
					method: "GET",
					scope: this,
					callback: function(request, success, response) {
						if(!success) {
							console.error(response);

							return;
						}

						Ext.callback(callback, this, [BPMSoft.decode(response.responseText).value]);
					}
				})
			},

			/**
			 * Диалог удаления коммуникации.
			 */
			deleteCommunicationDialog: function() {
				let controlsConfig = {
					text: {
						dataValueType: BPMSoft.DataValueType.TEXT,
						caption: this.get("Resources.Strings.DeleteTextCaption")
					}
				};
				
				BPMSoft.utils.inputBox(
					this.get("Resources.Strings.DeleteCommunicationDialogInputbox"),
					function(resultCode, dialogData) {
						if (resultCode === BPMSoft.MessageBoxButtons.OK.returnCode) {
							this.deleteCommunication(dialogData.text.value);
						}						
					},
										 
					[BPMSoft.MessageBoxButtons.OK],
					this,
					controlsConfig);
			},

			/**
			 * Удаляет коммуникацию.
			 * @param {string} communicationId Id коммуникации.
			 */
			deleteCommunication: function(communicationId) {
				let url = this.get("Resources.Strings.URL");

				let requestURL = url + 
					Ext.String.format(
						this.get("Resources.Strings.DeleteCommunicationUrl"),
						communicationId
					);

				BPMSoft.AjaxProvider.request({
					url: requestURL,
					method: "DELETE",
					scope: this,
					callback: function(success) {
						if (!success) {
							console.error(response);

							return;
						}

						BPMSoft.showInformation(
							this.get("Resources.Strings.DeleteCommunicationMessageSuccess")
						);
						this.reloadEntity();
					}
				});
			}
		},
	};
});