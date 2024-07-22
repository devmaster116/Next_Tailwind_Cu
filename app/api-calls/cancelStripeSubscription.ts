import { functions, httpsCallable } from "@/firebase/config";

export const cancelStripeSubscription = async (subscriptionId: string) => {

    const callCancelStripeSubscription = httpsCallable(functions, 'stripeSubscriptions-cancelStripeSubscription');
    return callCancelStripeSubscription({ subscriptionId  }).then((result:any) => {
        console.log('Cloud Function called successfully.', result);
        // Read results of the Cloud Function.
        const statusCode = result?.data?.statusCode;
        
        if (statusCode === 200){
            return result?.data?.url
        }else{
            throw new Error("cancelStripeSubscription Request not successful")
        }
    }).catch(function (error) {

        console.log('There was an error when calling the cancelStripeSubscription Cloud Function', error);
        
        throw error;

        // window.alert('There was an error when calling the Cloud Function:\n\nError Code: '
        //   + code + '\nError Message:' + message + '\nError Details:' + details);
    });
}