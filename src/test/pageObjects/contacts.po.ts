import MPopPage from "./page";
import {Page} from "@playwright/test";
import {MPOP_URL} from "../util/Data";

export default class ContactsLogPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Manage people on probation")
    }



}