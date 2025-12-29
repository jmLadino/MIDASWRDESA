async function onApiButtonClickAsync(executionContext) {
    //debugger;

    const tenantId = "2da74040-53ba-4f78-bfec-24b9437fbfe7";
    // Application Id
    const clientId = "c72e4073-a594-4d57-aea0-c8e022bb679e";
    // These privileges must be in AAD -> App Registration -> API Permissions
    const scopes = ["User.Read", "Calendars.Read"];

    // Redirect URI could be ideally some HTML web resource in D365, it's only for redirect in the hidden approach (SSO Silent login)
    const redirectUri = "https://powercode.crm2.dynamics.com//WebResources/mst_MsalTest.html";
    const userId = Xrm.Utility.getGlobalContext().userSettings.userId;
    const userName = (await Xrm.WebApi.retrieveRecord(
        "systemuser",
        userId,
        `?$select=domainname`
    ))?.domainname;

    const msalConfig = {
        auth: {
            clientId: clientId,
            authority: `https://login.microsoftonline.com/${tenantId}`,
            redirectUri: redirectUri,
            navigateToLoginRequestUrl: false,
        },
        cache: {
            cacheLocation: "localStorage", // This configures where your cache will be stored
            storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
        },
        system: {
            loggerOptions: {
                // loggerCallback: (level: LogLevel, message: string, containsPii: boolean): void => {
                //     if (containsPii) {
                //         return;
                //     }
                //     switch (level) {
                //         case LogLevel.Error:
                //             console.error(message, "MsalTest");
                //             return;
                //         case LogLevel.Info:
                //             console.info(message, "MsalTest");
                //             return;
                //         case LogLevel.Verbose:
                //             console.debug(message, "MsalTest");
                //             return;
                //         case LogLevel.Warning:
                //             console.warn(message, "MsalTest");
                //             return;
                //     }
                // },
                piiLoggingEnabled: true,
                //logLevel: LogLevel.Info
            },
            //allowRedirectInIframe: true,
        }
    };

    // https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/1-Authentication/1-sign-in
    const msalClient = new msal.PublicClientApplication(msalConfig);
    let authResult = undefined;

    try {
        let currentAccount = msalClient.getAllAccounts().filter(acc => acc.tenantId == tenantId)[0];
        authResult = await msalClient.ssoSilent({
            scopes: scopes,
            loginHint: currentAccount?.username ?? userName,
            redirectUri: redirectUri
        });

        console.trace(`Received Access Token via SSO Silent login.`, "MsalTest");
    }
    catch (error) {
        console.error(error, "MsalTest");
    }

    if (!authResult) {
        try {
            authResult = await msalClient.loginPopup({
                scopes: scopes,
                redirectUri: redirectUri,
                loginHint: userName,
            });
            console.trace(`Received Access Token via Login Popup.`, "MsalTest");
        }
        catch (error) {
            console.error(error, "MsalTest");
            if (error instanceof BrowserAuthError) {
                if (error.errorCode === "user_cancelled") {
                    // TODO show login again
                }
            }
        }
    }

    const accessToken = authResult?.accessToken;
    alert(`AccessToken: ${accessToken}`);

    const apiEndpoint = "https://graph.microsoft.com/v1.0/me/calendars";
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    };
    const apiResponse = await fetch(apiEndpoint, options);
    const apiRespJson = await apiResponse.json();

    const calendarNames = apiRespJson.value.map(c => c.name);
    alert(`Calendars: ${calendarNames}`);
    console.trace(apiRespJson, "MsalTest");
}
