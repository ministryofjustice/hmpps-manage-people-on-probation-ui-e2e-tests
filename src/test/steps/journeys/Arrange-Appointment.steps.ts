import { expect, Page } from '@playwright/test'
import { createBdd, DataTable } from 'playwright-bdd';
import AppointmentsPage from '../../pageObjects/Case/appointments.page'
import { appointmentDataTable, createAnotherAppointmentMPop, createAppointmentMPop, createSimilarAppointmentMPop, fullDetailsFromChanges, MpopAppointmentChanges, MpopArrangeAppointment, rescheduleAppointmentMPop, rescheduleDataTable, RescheduleDetails, setupAppointmentMPop } from '../../util/ArrangeAppointment'
import { testContext } from '../../features/Fixtures';
import LocationNotInListPage from '../../pageObjects/Case/Contacts/Appointments/location-not-in-list.page';
import ConfirmationPage from '../../pageObjects/Case/Contacts/Appointments/confirmation.page';
import OverviewPage from '../../pageObjects/Case/overview.page';
import ManageAppointmentsPage from '../../pageObjects/Case/Contacts/Appointments/manage-appointment.page';
import { getCalenderEvent, getClientToken, getExternalReference } from '../../util/API';
import { getUrn, getUuid } from '../../util/Common';
import { DateTime } from 'luxon';
import { today } from '../../util/DateTime';
import { checkOutlook } from '../../util/Outlook';
import CYAPage from '../../pageObjects/Case/Contacts/Appointments/CYA.page';

const { Given, When, Then } = createBdd(testContext);

When('I create an appointment', async ({ ctx }, data: DataTable) => {
    const page = ctx.base.page
    const crn = ctx.case.crn
    const appointments: AppointmentsPage = new AppointmentsPage(page, crn)
    await appointments.navigateTo()
    await appointments.checkOnPage()
    await appointments.startArrangeAppointment()

    const appointment: MpopArrangeAppointment = appointmentDataTable(data, true) as MpopArrangeAppointment
    ctx.appointments.push(appointment)
    await createAppointmentMPop(page, appointment)
});

When('I confirm the appointment', async ({ ctx }, data: DataTable) => {
    const page = ctx.base.page
    const crn = ctx.case.crn
    const appointments: AppointmentsPage = new AppointmentsPage(page, crn)
    await appointments.navigateTo()
    await appointments.checkOnPage()
    await appointments.startArrangeAppointment()

    const appointment: MpopArrangeAppointment = appointmentDataTable(data, true) as MpopArrangeAppointment
    ctx.appointments.push(appointment)
    await createAppointmentMPop(page, appointment)
});

When('I create a similar appointment', async ({ ctx }, data: DataTable) => {
    const changes: MpopAppointmentChanges = appointmentDataTable(data)
    const appointment = fullDetailsFromChanges(changes, ctx.appointments[ctx.appointments.length-1])
    ctx.appointments.push(appointment)
    await createSimilarAppointmentMPop(ctx.base.page, changes)
});

When('I create another appointment', async ({ ctx }, data:DataTable) => {
    const appointment: MpopArrangeAppointment = appointmentDataTable(data, true) as MpopArrangeAppointment
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
    const token = await getClientToken()
    const confirmationPage = new ConfirmationPage(page)
    await confirmationPage.completePage("overview")
    const overviewPage = new OverviewPage(page)
    await overviewPage.checkOnPage()
    await overviewPage.useSubNavigation("appointmentsTab")
    for (let a = 0; a < ctx.appointments.length; a++){
        const appointment : MpopArrangeAppointment = ctx.appointments[a]
        const past = DateTime.fromFormat(appointment.dateTime.date, "d/M/yyyy")  < today
        const appointmentsPage = new AppointmentsPage(page)
        await appointmentsPage.checkOnPage()
        await appointmentsPage.manageAppointment(appointment)
        const managePage = new ManageAppointmentsPage(page)
        await managePage.checkOnPage()
        await checkOutlook(page, ctx.case.crn, token, past)
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
    ctx.appointments[0] = appointment
    const rescheduleDetails: RescheduleDetails = rescheduleDataTable(data)
    await rescheduleAppointmentMPop(page, rescheduleDetails, changes)
});

When('I setup an appointment', async ({ ctx }, data: DataTable) => {
    const page = ctx.base.page
    const crn = ctx.case.crn
    const appointments: AppointmentsPage = new AppointmentsPage(page, crn)
    await appointments.navigateTo()
    await appointments.checkOnPage()
    await appointments.startArrangeAppointment()

    const appointment: MpopArrangeAppointment = appointmentDataTable(data, true) as MpopArrangeAppointment
    ctx.appointments.push(appointment)
    const past = DateTime.fromFormat(appointment.dateTime.date, "d/M/yyyy")  < today
    await setupAppointmentMPop(page, appointment, past)
});

When('I make the following changes to appointment', async({ ctx }, data:DataTable) => {
    const page = ctx.base.page
    const changes: MpopAppointmentChanges = appointmentDataTable(data)
    let appointment = ctx.appointments[ctx.appointments.length-1]
    const currentPast = DateTime.fromFormat(appointment.dateTime.date, "d/M/yyyy")  < today
    appointment = fullDetailsFromChanges(changes, appointment)
    ctx.appointments[ctx.appointments.length-1] = appointment
    const cyaPage = new CYAPage(page)
    await cyaPage.checkOnPage()
    const newPast = DateTime.fromFormat(appointment.dateTime.date, "d/M/yyyy")  < today
    await cyaPage.makeChanges(changes, appointment.typeId, currentPast, newPast)
})

When('I complete the submission', async({ ctx }) => {
    const page = ctx.base.page
    const appointment = ctx.appointments[ctx.appointments.length-1]
    const past = DateTime.fromFormat(appointment.dateTime.date, "d/M/yyyy")  < today
    await setupAppointmentMPop(page, appointment, past)
    if (appointment.locationId === 'not in list'){
        return
    }
    const cyaPage = new CYAPage(page)
    await cyaPage.completePage(appointment.isVisor, past)
    const confirmationPage = new ConfirmationPage(page, past)
    await confirmationPage.checkOnPage()
})