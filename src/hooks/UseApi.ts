import axios, { AxiosRequestConfig } from "axios";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation, useQuery, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import { LoginState, UserState } from 'recoils/LoginRecoil';

type ApiState = {
    method : "get" | "post" | "put",
    url: string,
    apiName: string,
    params?: any,
    body?: any
    time: number | false;
    async : boolean;
}

const instance = axios.create({

  // package.json에 proxy주소 있음
  // baseURL: "/BuyInHotelEvent/",
  //headers: {
  // 	'Content-type': 'application/json; charset=UTF-8',
  // 	'accept': 'application/json,',
  // 	'user' : 'AppIDEtest',
  //}

});

export function UseApis({method, url, apiName, params, body, time, async}: ApiState) {

    // recoil-persist 사용
    const userData = useRecoilValue<UserState>(LoginState);

    // AxiosRequestConfig에 값을 넣으면 axios.get(url, parms..) 쓰는것과 같은 효과
    const config: AxiosRequestConfig = { method: method, url: url, params: params, data: body, headers : {'user': userData.userToken}};
    // console.log(config);

    const { isLoading, data, error, remove, refetch } = useQuery(
        apiName,
        async () => {
            const { data } = await instance(config);
            //console.log(data);
            if(error !== null) {
                console.log(error);
                throw error;
            }

            return data;
            
        },
        { 
            enabled : !!async,
            // 지정한 시간에 따라 refetch, 1000 = 1 secound, false일경우 동작 안함
            refetchInterval: time, 
            // 렌더 중에 사용 중인 속성을 알아서 추적하고 사용 중인 속성들이 변화가 있을 때에만 리렌더링
            notifyOnChangeProps: 'tracked',
            // 데이터가 stale 상태일 경우 윈도우 포커싱 될 때 마다 refetch를 실행
            refetchOnWindowFocus: false,
            // 데이터가 stale 상태일 경우 마운트 시 마다 refetch를 실행
            //refetchOnMount: false,
            // 데이터가 stale 상태일 경우 재 연결 될 때 refetch를 실행
            //refetchOnReconnect: false
        }
    )

    return { isLoading, data, remove, refetch };
}

type MutationState = {
    method : "get" | "post" | "put" | "delete",
    url: string,
    apiName: string,
    params?: any,
    body?: any,
    refresh?:<TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>,
    returnData?: React.Dispatch<React.SetStateAction<any | undefined>>,
}

export function UseMutation({method, url, apiName, params, body, refresh, returnData}: MutationState) {
    
  const queryClient = useQueryClient();  // 등록된 quieryClient 가져오기

  // recoil-persist 사용
  const userData = useRecoilValue<UserState>(LoginState);

  const config: AxiosRequestConfig<any> = { method: method, url: url, params: params, data: body, headers : {'user': userData.userToken} };

  const mutation = useMutation(
    apiName, {
      mutationFn: () => instance(config),
      onSuccess: (data) => { // 요청이 성공한 경우
        console.log('onSuccess');
        
        if(returnData) {
          console.log("return");
          returnData(data.data);
        }

        console.log(data.data);

        if(refresh) {
          refresh();
        }
        queryClient.invalidateQueries(apiName); // queryKey 유효성 제거
      },
      onError: (error) => { // 요청에 에러가 발생된 경우
          console.log('onError');
          console.log(error);
      }
      // onSettled: () => { // 요청이 성공하든, 에러가 발생되든 실행하고 싶은 경우
      //     console.log('onSettled');
      // },
    }
  );

  return mutation;
}