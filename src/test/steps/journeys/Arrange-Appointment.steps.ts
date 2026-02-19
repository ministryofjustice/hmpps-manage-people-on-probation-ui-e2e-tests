import { expect, Page } from '@playwright/test'
import { createBdd, DataTable } from 'playwright-bdd';
import AppointmentsPage from '../../pageObjects/Case/appointments.page'
import { appointmentDataTable, createAnotherAppointmentMPop, createAppointmentMPop, createSimilarAppointmentMPop, fullDetailsFromChanges, MpopAppointmentChanges, MpopArrangeAppointment, rescheduleAppointmentMPop, rescheduleDataTable, RescheduleDetails } from '../../util/ArrangeAppointment'
import { testContext } from '../../features/Fixtures';
import LocationNotInListPage from '../../pageObjects/Case/Contacts/Appointments/location-not-in-list.page';
import ConfirmationPage from '../../pageObjects/Case/Contacts/Appointments/confirmation.page';
import NextAppointmentPage, { NextAction } from '../../pageObjects/Case/Contacts/Appointments/next-appointment.page';
import OverviewPage from '../../pageObjects/Case/overview.page';
import ManageAppointmentsPage from '../../pageObjects/Case/Contacts/Appointments/manage-appointment.page';

const { Given, When, Then } = createBdd(testContext);

When('I create an appointment', async ({ ctx }, data: DataTable) => {
    const page = ctx.base.page
    const crn = ctx.case.crn
    const appointments: AppointmentsPage = new AppointmentsPage(page, crn)
    await appointments.navigateTo()
    await appointments.checkOnPage()
    await appointments.startArrangeAppointment()

    const appointment: MpopArrangeAppointment = appointmentDataTable(data, true) as MpopArrangeAppointment
    console.log(appointment)
    ctx.appointments.push(appointment)
    await createAppointmentMPop(page, appointment)
});

When('I create a similar appointment', async ({ ctx }, data: DataTable) => {
    const changes: MpopAppointmentChanges = appointmentDataTable(data)
    const appointment = fullDetailsFromChanges(changes, ctx.appointments[ctx.appointments.length-1])
    console.log(appointment)
    ctx.appointments.push(appointment)
    await createSimilarAppointmentMPop(ctx.base.page, changes)
});

When('I create another appointment', async ({ ctx }, data:DataTable) => {
    const appointment: MpopArrangeAppointment = appointmentDataTable(data, true) as MpopArrangeAppointment
    console.log(appointment)
    ctx.appointments.push(appointment)
    await createAnotherAppointmentMPop(ctx.base.page, appointment)
});

Then('the appointment should be created successfully', async ({ ctx }) => {
    await expect(ctx.base.page.locator('[data-qa="pageHeading"]')).toContainText("arranged")
});

Then('the appointment should be rescheduled successfully', async ({ ctx }) => {
    await expect(ctx.base.page.locator('[data-qa="pageHeading"]')).toContainText("rescheduled")
});

Then('I end up on the location-not-in-list page', async ({ ctx }) => {
    const locationNotInListPage = new LocationNotInListPage(ctx.base.page)
    await locationNotInListPage.checkOnPage()
});

Then('I can check appointment details with the manage page', async ({ ctx }) => {
    const page = ctx.base.page
    const confirmationPage = new ConfirmationPage(page)
    await confirmationPage.completePage("overview")
    const overviewPage = new OverviewPage(page)
    await overviewPage.checkOnPage()
    await overviewPage.useSubNavigation("appointmentsTab")
    for (let a = 0; a < ctx.appointments.length; a++){
        const appointment : MpopArrangeAppointment = ctx.appointments[a]
        const appointmentsPage = new AppointmentsPage(page)
        await appointmentsPage.checkOnPage()
        await appointmentsPage.manageAppointment(appointment)
        const managePage = new ManageAppointmentsPage(page)
        await managePage.checkOnPage()
        await managePage.clickBackLink()
    }
});

When('I access an existing future appointment', async ({ ctx }) => {
    const page = ctx.base.page
    const appointment : MpopArrangeAppointment = ctx.appointments[0]
    const appointmentsPage = new AppointmentsPage(page)
    await appointmentsPage.checkOnPage()
    await appointmentsPage.manageAppointment(appointment)
    const managePage = new ManageAppointmentsPage(page)
    await managePage.checkOnPage()
    await managePage.page.getByRole('link', {name: "Reschedule"}).click()
});

When('I reschedule it with the following information', async ({ ctx }, data:DataTable) => {
    const page = ctx.base.page
    const changes: MpopAppointmentChanges = appointmentDataTable(data)
    const appointment = fullDetailsFromChanges(changes, ctx.appointments[0])
    console.log(appointment)
    ctx.appointments[0] = appointment
    const rescheduleDetails: RescheduleDetails = rescheduleDataTable(data)
    console.log(rescheduleDetails)
    await rescheduleAppointmentMPop(page, rescheduleDetails, changes)
});
