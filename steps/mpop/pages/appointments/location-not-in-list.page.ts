import { expect, Page } from "@playwright/test";
import MPopPage from "../page";
import { MpopDateTime } from "../../navigation/create-appointment";
import TypeAttendancePage from "./type-attendance.page";

export default class LocationNotInListPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Arrange an appointment in another location")
    }
}