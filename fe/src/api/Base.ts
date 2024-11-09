import axios, { AxiosInstance } from 'axios';

export class Base {
    public default: AxiosInstance;

    private readonly defaultApi = `${process.env.NEXT_PUBLIC_API_HOST}`;
    protected readonly defaultApiInstance = Base.setInstance(this.defaultApi);

    public constructor() {
        this.default = this.defaultApiInstance('/');
    }

    private static setInstance(baseUrl: string) {
        return (path: string) => {
            const instance = axios.create({
                baseURL: `${baseUrl}${path}`,
                // withCredentials: true,
            });

            return instance;
        };
    }
}
