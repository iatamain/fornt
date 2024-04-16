var dataNews = [
   {
      header: "Каруселька, eee",
      body: "На эту штуку, однако, ушло довольно много времени.-. Зато теперь закидывать новости крайне удобно:D",
      img: "images/news/news03.png"
   },
   {
      header: "Добавили опыт",
      body: "Добавили шкалу опыта и отображение текущего уровня",
      img: "images/GUI/lvl.png"
   },
   {
      header: "Много",
      body: "Много-много делали много чего",
      img: "images/news/news01.webp"
   },
   {
      header: "Обновление 0.1.10",
      body: "Бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла:D",
      img: "images/news/news00.jpg"
   }
];
var interfaceData = {
   main: {
      playerInfo: "deactive-left",
      goToPlay: "deactive-left",
      news: "deactive-right"
   },
   rooms: {
      listRooms: "deactive-left",
      createRoom: "deactive-right"
   },
   achievements: {
      achievementsContainer: "deactive-bottom"
   },
   store: {
      storeItems: "deactive-bottom"
   },
   altar: {
      altarContainer: "deactive-bottom"
   },
   elementary: {
      elementaryContainer: "deactive-bottom"
   },
   clans: {
      clansContainer: "deactive-bottom"
   },
   ranking: {
      rankingContainer: "deactive-bottom"
   }
}
var gameData = {
  roomN: 0,
  dataRoom: {}
}
class PlayerInf {
	constructor() {
		this.nickName = "Temp";
		this.clan = "Temp";
		this.element = "Temp";
		this.id = 1;
		this.rank = 42;
		this.rankingPos = 42;
		this.lvl = 2;
		this.experience = 42;
		this.amountCrystal = 42;
		this.progress = {};
		this.achievements = {};
		this.purchasedItems = {};
		this.statistics = {
			kills: 42,
			battles: 42
		}
	}
	getData(ID){
		console.log("В разработке " + ID);
	}
}
var mainPlayerInf = new PlayerInf();
