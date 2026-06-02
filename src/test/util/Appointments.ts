import ManageAppointmentsPage from "../pageObjects/Case/Contacts/Appointments/manage-appointment.page";
import MPopPage from "../pageObjects/page";

export const searchForAppointment = async (
  initialPage: MPopPage,
  targetPage: ManageAppointmentsPage,
  type: string | RegExp,
  sensitive: boolean,
) => {
  let id = 0;
  while (true) {
    await initialPage.assertOnPage();
    try {
      await initialPage.page.getByRole("link", { name: type }).nth(id).click();
    } catch {
      await initialPage.pagination("Next");
      id = 0;
      continue;
    }
    const restricted = await targetPage.assertOnPage();
    if (restricted === "restricted") {
      id += 1;
      continue;
    }
    try {
      await targetPage.checkSensitive(sensitive);
      break;
    } catch {
      await targetPage.clickBackLink();
      id += 1;
    }
  }
};
