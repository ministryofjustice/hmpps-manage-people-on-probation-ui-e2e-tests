import { expect, Page } from '@playwright/test'
import { createBdd } from 'playwright-bdd';
import { attendee, testCrn } from '../../util/Data'
import AppointmentsPage from '../../pageObjects/Case/appointments.page'
import { testContext } from '../../features/Fixtures';
import ManageAppointmentsPage from '../../pageObjects/Case/Contacts/Appointments/manage-appointment.page';
import AddNotePage from '../../pageObjects/Case/Contacts/Appointments/add-note.page';
import HomePage from '../../pageObjects/home.page';
import LogOutcomesPage from '../../pageObjects/log-outcomes.page';
import AttendedCompliedPage from '../../pageObjects/Case/Contacts/Appointments/attended-complied.page';
import UpcomingAppiointmentsPage from '../../pageObjects/upcoming.page';

const { Given, When, Then } = createBdd(testContext);

When('I navigate to latest past appointment', async ({ ctx }) => {
    const page = ctx.base.page
    const appointments: AppointmentsPage = new AppointmentsPage(page, testCrn)
    await appointments.navigateTo()
    await appointments.assertOnPage()
    await appointments.selectPastAppointment(1)
    const managePage = new ManageAppointmentsPage(page)
    await managePage.assertOnPage()
});

When('I navigate to first upcoming appointment', async ({ ctx }) => {
    const page = ctx.base.page
    const home = new HomePage(page)
    await home.assertOnPage()
    await home.viewUpcoming()
    const upcomingAppointments = new UpcomingAppiointmentsPage(page)
    await upcomingAppointments.assertOnPage()
    await upcomingAppointments.selectOfficeVisit()
    const managePage = new ManageAppointmentsPage(page)
    await managePage.assertOnPage()
});

When('I add a note to the appointment', async ({ ctx }) => {
    const page = ctx.base.page
    const managePage = new ManageAppointmentsPage(page)
    const noteCount = await managePage.getNoteCount()
    await managePage.clickAddNotesLink()
    const addNotePage = new AddNotePage(page)
    await addNotePage.completePage(false, "note")
    ctx.manage.noteCount = noteCount
})

Then('I can see the new note on the appointment', async ({ ctx }) => {
    const page = ctx.base.page
    const managePage = new ManageAppointmentsPage(page)
    await managePage.assertOnPage()
    expect(await managePage.getNoteCount()).toBe(ctx.manage.noteCount + 1)
    await expect((await managePage.getAppointmentNotes()).first()).toContainText("note")
})

When('I navigate to latest appointment requiring an outcome', async ({ ctx }) => {
    const page = ctx.base.page
    const home = new HomePage(page)
    await home.assertOnPage()
    await home.logMoreOutcomes()
    const logPage = new LogOutcomesPage(page)
    await logPage.assertOnPage()
    const managePage = new ManageAppointmentsPage(page)
    let id = 0
    while (true){
        try {
            await logPage.selectFirst(id)
        } catch {
            await logPage.pagination("Next")
            id = 0
            continue
        }
        await managePage.assertOnPage() //will backLink if restricted
        const restricted = await logPage.checkOnPage()
        if (!restricted){
            break
        }
        id += 1
    }
    await expect(managePage.getQA("appointmentAlert")).toContainText("You must log an outcome")
});

When('I mark the attended complied outcome', async ({ ctx }) => {
    const page = ctx.base.page
    const managePage = new ManageAppointmentsPage(page)
    await managePage.clickAttendedAndCompliedLink()
    const attendedCompliedPage = new AttendedCompliedPage(page)
    await attendedCompliedPage.assertOnPage()
    await attendedCompliedPage.completePage()
    const addNotePage = new AddNotePage(page)
    await addNotePage.completePage(false, "note")
})

Then('I can see the attended and complied status', async ({ ctx }) => {
    const page = ctx.base.page
    const managePage = new ManageAppointmentsPage(page)
    await managePage.assertOnPage()
    await expect(managePage.getByID('appointment-actions-1-status')).toContainText('Complied')
})
