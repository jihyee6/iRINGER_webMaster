import axios from "axios";

export const instance = axios.create({

	// package.json에 proxy주소 있음
	// baseURL: "/BuyInHotelEvent/",
	//headers: {
	// 	'Content-type': 'application/json; charset=UTF-8',
	// 	'accept': 'application/json,',
	// 	'user' : 'AppIDEtest',
	//}
});