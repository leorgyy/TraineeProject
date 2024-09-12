 define("ClientMessageBridge", [], function() {
	return {
		messages: {
			/**
			 * Контакт был обновлен.
			 */
			"ContactUpdated": {
				mode: BPMSoft.MessageMode.BROADCAST,
				direction: BPMSoft.MessageDirectionType.PUBLISH,
			},
		},
		methods: {
			/**
			 * Инициализация схемы.
			 */
			init: function() {
				this.callParent(arguments);

				this.addMessageConfig({
					sender: "ContactUpdated",
					messageName: "ContactUpdated",
				});
			}
		},
	};
});