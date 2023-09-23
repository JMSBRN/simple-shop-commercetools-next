import { apiRoot } from '@/commercetools/BuildClient';

export const login = async (email:string, password: string) => {
    try {
        const res= await apiRoot.login().post({
             body: {
                 email,
                 password
             }
         }).execute();
     
         console.log(res);
        
    } catch (error) {
        if(error) throw new Error('error', error);
    }
};
export const singOut = async (email:string, password: string) => {
   return ( await apiRoot.customers().post({
        body: {
            email,
            password
        }
    }).execute());
};

