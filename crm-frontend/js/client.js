export default class Client {
  constructor(clientItem) {
    this.id = clientItem.id;
    this.name = clientItem.name;
    this.surname = clientItem.surname;
    this.lastName = clientItem.lastName;
    this.createdAt = new Date(clientItem.createdAt);
    this.updatedAt = new Date(clientItem.updatedAt);
    this.contacts = clientItem.contacts;
  }

  get ID() {
    return `${this.id}`;
  }

  get FIO() {
    return `${this.surname} ${this.name} ${this.lastName}`;
  }

  get CreatedAt() {
    const yyyy = this.createdAt.getFullYear();
    let mm = this.createdAt.getMonth() + 1;
    let dd = this.createdAt.getDate();
    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;

    return `${dd}.${mm}.${yyyy}`;
  }

  get CreatedAtTime() {
    let h = this.createdAt.getHours();
    let m = this.createdAt.getMinutes();
    if (h < 10) h = `0${h}`;
    if (m < 10) m = `0${m}`;

    return `${h}:${m}`;
  }

  get UpdatedAt() {
    const yyyy = this.updatedAt.getFullYear();
    let mm = this.updatedAt.getMonth() + 1;
    let dd = this.updatedAt.getDate();
    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;

    return `${dd}.${mm}.${yyyy}`;
  }

  get UpdatedAtTime() {
    let h = this.updatedAt.getHours();
    let m = this.updatedAt.getMinutes();
    if (h < 10) h = `0${h}`;
    if (m < 10) m = `0${m}`;

    return `${h}:${m}`;
  }

  get Contacts() {
    if (this.contacts === undefined) {
      this.contacts = null;
    } else {
      for (const contactsItem of this.contacts) {
        if (contactsItem.type.toLowerCase() === 'телефон') {
          contactsItem.value = contactsItem.value.replace(/^\+?(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/, '+$1 ($2) $3-$4-$5');
        } else {
          contactsItem.value = contactsItem.value.replace(/(^\w+:|^)\/\//, '');
        }
      }
      return this.contacts;
    }
  }
}
