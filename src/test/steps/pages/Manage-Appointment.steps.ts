import { expect, Page } from '@playwright/test'
import { createBdd } from 'playwright-bdd';
import { attendee, testCrn } from '../../util/Data'
import AppointmentsPage from '../../pageObjects/Case/appointments.page'
import { testContext } from '../../features/Fixtures';
import ManageAppointmentsPage from '../../pageObjects/Case/Contacts/Appointments/manage-appointment.page';
import AddNotePage from '../../pageObjects/Case/Contacts/Appointments/add-note.page';

const { Given, When, Then } = createBdd(testContext);

When('I navigate to latest past appointment', async ({ ctx }) => {
    const page = ctx.base.page
    const appointments: AppointmentsPage = new AppointmentsPage(page, testCrn)
    await appointments.navigateTo()
    await appointments.checkOnPage()
    await appointments.selectPastAppointment(1)
    const managePage = new ManageAppointmentsPage(page)
    await managePage.checkOnPage()
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
    await managePage.checkOnPage()
    expect(await managePage.getNoteCount()).toBe(ctx.manage.noteCount + 1)
    await expect((await managePage.getAppointmentNotes()).first()).toContainText("note")
})
