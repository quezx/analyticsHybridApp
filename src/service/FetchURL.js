
export const getMetaBaseURL = (id, dashboardId, metaBaseUrl) => {

    const URL = `https://staging-analytics.quezx.com/api/dashboard/${id}?dashboard_id=${dashboardId}&metabaseUrl=${metaBaseUrl}`;
    return fetch(URL, {
        method: 'GET',
            headers: {
            Accept: 'application/json',
                'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstParam: 'Authorization',
            secondParam: 'Bearer 8cacf9024424bd8b0fa774040333b9a3f19f6a89',
        })
        .then((res) => res.json())

},)};
