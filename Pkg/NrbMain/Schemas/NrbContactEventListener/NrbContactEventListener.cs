using System;
using BPMSoft.Core.Entities;
using BPMSoft.Core.Entities.Events;

namespace BPMSoft.Configuration
{
	/// <summary>
	/// Обработчик событий Контакта.
	/// </summary>
	[EntityEventListener(SchemaName = "Contact")]
	public class NrbContactEventListener : BaseEntityEventListener
	{
		/// <summary>
		/// Обработчик события после добавления контакта.
		/// </summary>
		/// <param name="sender">Инициатор события.</param>
		/// <param name="e">Аргументы события.</param>
		public override void OnInserted(object sender, EntityAfterEventArgs e)
		{
			base.OnInserted(sender, e);

			var contact = (Entity)sender;

			CreateActivity(contact);
		}

		/// <summary>
		/// Создаетт активность.
		/// </summary>
		/// <param name="contact">Контакт.</param>
		protected virtual void CreateActivity(Entity contact)
		{
			const int ShowSchedulerValue = 1;

			var id = contact.GetTypedColumnValue<Guid>("Id");
			var contactName = contact.GetTypedColumnValue<String>("Name").Split(' ')[0];
			var creatorId = contact.GetTypedColumnValue<String>("CreatedById").Split(' ')[0];
			var username = contact.UserConnection.CurrentUser.ContactName.Split()[0];

			var addSchema = contact.UserConnection.EntitySchemaManager.GetInstanceByName("Activity");
			var entity = addSchema.CreateEntity(contact.UserConnection);

			entity.SetColumnValue("Id", Guid.NewGuid());
			entity.SetColumnValue("ContactId", id);
			entity.SetColumnValue("Title", $"{username}_{contactName}");
			entity.SetColumnValue("OwnerId", creatorId);
			entity.SetColumnValue("ShowInScheduler", ShowSchedulerValue);

			entity.SetDefColumnValues();

			entity.Save();
		}
	}
}