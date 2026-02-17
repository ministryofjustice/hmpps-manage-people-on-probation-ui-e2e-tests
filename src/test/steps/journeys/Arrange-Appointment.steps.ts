import { expect, Page } from '@playwright/test'
import { createBdd, DataTable } from 'playwright-bdd';
import AppointmentsPage from '../../pageObjects/Case/appointments.page'
import { appointmentDataTable, createAnotherAppointmentMPop, createAppointmentMPop, createSimilarAppointmentMPop, MpopAppointmentChanges, MpopArrangeAppointment } from '../../util/ArrangeAppointment'
import { testContext } from '../../features/Fixtures';

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
    await createAppointmentMPop(page, appointment)
});

When('I create a similar appointment', async ({ ctx }, data: DataTable) => {
    const changes: MpopAppointmentChanges = appointmentDataTable(data)
    console.log(changes)
    await createSimilarAppointmentMPop(ctx.base.page, changes)
});

When('I create another appointment', async ({ ctx }, data:DataTable) => {
    const appointment: MpopArrangeAppointment = appointmentDataTable(data, true) as MpopArrangeAppointment
    console.log(appointment)
    await createAnotherAppointmentMPop(ctx.base.page, appointment)
});

Then('the appointment should be created successfully', async ({ ctx }) => {
    await expect(ctx.base.page.locator('[data-qa="pageHeading"]')).toContainText("arranged")
});