export const perfConfig = {
    baseUrl:
        process.env.PERF_BASE_URL ??
        "https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk",

    username: process.env.DELIUS_USERNAME,
    password: process.env.DELIUS_PASSWORD,

    users: Number(process.env.PERF_USERS ?? "5"),
    rampSeconds: Number(process.env.PERF_RAMP_SECONDS ?? "30"),
    durationSeconds: Number(process.env.PERF_DURATION_SECONDS ?? "60"),
}