
console.log("URL", parseGet(window.location.href));
var snsPlayerInf = {
	snsId: parseGet(window.location.href).user_id || parseGet(window.location.href).logged_user_id,
	authKey: parseGet(window.location.href).auth_key,
	apiId: parseGet(window.location.href).api_id,
	viewerId: parseGet(window.location.href).viewer_id,
	firstName: "Ноунейм",
	lastName: "Temp",
	birthDay: "1.1.1970",
	avatar: "http://osh.advokatura.kg/sites/default/files/default-avatar.png",
	sex: "",
	country: "",
	friends: [] //Avatar, link, new PlayerInf, snsId, FirstName, LastName
}
var session = {
	isFirstEntry: true,
	isFirstEntryToday: true,
	snsName: parseGet(window.location.href).runner,
	howManyDays: 42,
}
if(session.snsName === "vk"){
	VK.init(function() {
		VK.addCallback('onRequestFail', function (error){
            processError(error, "apivk");
       });
		 VK.api("users.get", {"user_ids": snsPlayerInf.viewerId, "fields": "photo_200,sex,bdate,country,screen_name,photo_id", "v":"5.103"}, function (data) {
			console.log(data.response[0]);
			snsPlayerInf.firstName = data.response[0].first_name; //Получаем имя
			snsPlayerInf.lastName = data.response[0].last_name; //Получаем фамилию
			snsPlayerInf.birthDay = data.response[0].bdate; //Получаем дату др
			snsPlayerInf.avatar = data.response[0].photo_200; //Получаем аву
			snsPlayerInf.sex = data.response[0].sex; //1 -- Female, 2 -- Male;
			if(data.response[0].country)
				snsPlayerInf.country = data.response[0].country.title; //Получаем страну
			else
				snsPlayerInf.country = null;
			send(snsPlayerInf, "/api/user/update", "put", response=>{ //Отправляем данные на наш серв
				let responseObj = response.json()
				 responseObj.then(value => {
					 console.log(value); //Получаем ответочку с необходимыми данными
					 mainPlayerInf.nickName = value.nickname;
					 mainPlayerInf.clan = "";
					 mainPlayerInf.element = "Земля";
					 mainPlayerInf.lvl = value.lvl;
					 mainPlayerInf.experience = value.experience;
					 mainPlayerInf.amountCrystal = value.amountCrystal;
					 mainPlayerInf.statistics = {
	 					kills: value.gamesWon,
	 					battles: value.gamesTotal
	 				}
					mainPlayerInf.rank = value.rank;
					mainPlayerInf.rankingPos = value.rankingPos;
					mainPlayerInf.progress = value.progress;
					mainPlayerInf.achievements = value.achivements
					mainPlayerInf.purchasedItems = null;
					mainPlayerInf.id = value.id;
					session.isFirstEntry = value.isFirstLogin;
					session.isFirstEntryToday = value.isFirstLoginToday;
					session.howManyDays = "";
					setInterface();
					connectToSocket();
				});
			});
			rooms.set("set");
		});
		VK.api("friends.getAppUsers", {"v":"5.103"}, function (data) { //Получаем массив id Друзей
			console.log(data);
			for(var i = 0; i < data.response.length; i+=10){
				VK.api("users.get", {"user_ids": data.response.slice(i, i+10), "fields": "photo_200,sex,country,verified,screen_name,photo_id", "v":"5.103"}, function (data) { //Получаем инфу о каждом друге
					console.log(data);
					data.response.forEach(function(friend) {
						snsPlayerInf.friends.push({
							friendPlayerInfo: new PlayerInf(),
							firstName: friend.first_name,
							lastName: friend.last_name,
							avatar: friend.photo_200,
							link: "https://vk.com/id" + friend.id,
							snsId: friend.id
						})
					});
					setFriends();
					console.log(snsPlayerInf);
				});
			}
			console.log(snsPlayerInf);
		});
	},
	function() {
		processError(error, "vk.com");
	}, '5.103');
}else if(session.snsName === "ok"){
	console.log(parseGet(window.location.href));
	var rParams = FAPI.Util.getRequestParameters();								//Параметры инициализации
	FAPI.init(rParams["api_server"], rParams["apiconnection"],		//Инициализация
	function() {
		console.log("Инициализация прошла успешно");																	//Функция запросов
		FAPI.Client.call({"fields":"first_name,last_name,pic_3,birthday,gender,location","method":"users.getCurrentUser"},function(status, data, error){  //Получение информации о пользователе
			console.log(data);
			if(data) {
				snsPlayerInf.firstName = data.first_name;		  //Получает имя
				snsPlayerInf.lastName = data.last_name;				//Получает фамилию
				snsPlayerInf.avatar = data.pic_3;							//Получает аватарку
				snsPlayerInf.birthDay = data.birthday;				//Получаем дату рождения
				snsPlayerInf.sex = data.gender;								//Получаем пол
				snsPlayerInf.country = data.location.countryName; //Получаем страну
				if(session.isFirstEntry){ //Если первый вход...
					mainPlayerInf.nickName = snsPlayerInf.firstName + " " + snsPlayerInf.lastName;
					mainPlayerInf.clan = "";
					mainPlayerInf.element = "Земля"; //Должен быть на выбор						mainPlayerInf.lvl = 1;
					mainPlayerInf.experience = 0;
					mainPlayerInf.amountCrystal = 0;
					statistics = {
						kills: 0,
						battles: 0,
					}
					connectToSocket();
				}
				console.log(snsPlayerInf.firstName + " - " + snsPlayerInf.lastName + "\n" + snsPlayerInf.snsId + " - " + snsPlayerInf.authKey);
				console.log(snsPlayerInf);
			}else{
				processError(error, "okGetCurrentUser");
				console.log("Неудалось запросить данные текущего пользователя");
			}
			setInterface();
			rooms.set("set");
		});
		//Получение информации о друзьях и их списке
		FAPI.Client.call({"fields": "uid", "method": "friends.getAppUsers"}, function(status, idFriends,error){ //получение id друзей
			if(idFriends){
					FAPI.Client.call({"uids": idFriends.uids, "fields": "first_name,last_name,pic_3,uid", "method": "users.getInfo"}, function(status, infoFriends, error){ //Получение информации о друзьях
						if(infoFriends){
								console.log(infoFriends);
								infoFriends.forEach(function(friend) {
									snsPlayerInf.friends.push({
										friendPlayerInfo: new PlayerInf(),
										firstName: friend.first_name,
										lastName: friend.last_name,
										avatar: friend.pic_3,
										link: "https://ok.ru/profile/" + friend.uid,
										snsId: friend.uid
									})
								});
								setFriends();
						} else {
							processError(error);
							console.log("Не удалось получить данные о друзьях");
						}
					});	//end 2
			} else {
				processError(error, "okGetAppUsers");
				console.log("Не удалось запросить uID друзей пользователя");
			}
		});
	},	//Закрытие функции инициализации
	function(error){
		processError(error, "ok.ru");
	});
}else if(session.snsName === "fb"){
	alert("Зашли через fb с:")
	FB.init({															//Инициализация приложения
	  appId      : '357318211878770',
	  status     : true,
	  xfbml      : true,
	  version    : 'v4.0'
	});
	connectToSocket();
}else{
	for(let i = 0; i < 100; i++){
		let str = ["ле", "на", "нас", "ба", "еб", "лу", "ла", "ка", "ми", "ну"];
		let mode = ["DM", "TDM", "CTF", "CP"]
		let randoms = [];
		let name = "";
		for(let j = 0; j <= 10; j++){
			randoms.push(Math.floor(0 + Math.random() * (9 - 0 + 1)));
		}
		for(let j = 0; j <= randoms[10]; j++){
			name += str[randoms[j]];
		}
		name = "";
		for(let j = 0; j <= Math.min(6, randoms[10]); j++){
			name += str[randoms[j]];
		}
		snsPlayerInf.friends[i] = {
			firstName: name,
			lastName: "teeeeeeeest",
			avatar: "http://osh.advokatura.kg/sites/default/files/default-avatar.png",
			link: "http://vk.com/id" + i
		}
	}
	setInterface();
	setFriends();
	connectToSocket();
}
