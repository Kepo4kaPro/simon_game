const level_t = [1.5, 1.0, 0.4];        // Времянной массив смены карт

let level = 0;                          // Выбранный уровень сложности
let game_array = [];                    // Массив проявления карт
let user_inpt_n = 0;                    // Вводимая игроком карта
let is_game_render = true;              // Отображает ли сейчас игра комбинацию
let ausio_dom = [];                     // Массив звуковых эффектов
let time = 0.0;                         // Время
let time_id = null;                     // Идентефикатор таймера
let main_con;                           // Vue
// Загружаем звуки в игру
for(let i=0; i<4; i++){
    ausio_dom[i] = new Audio("sounds/"+String(i)+".mp3");
}
// Запускаем Vue.js
document.addEventListener('DOMContentLoaded', function (){
    main_con = new Vue({
        el: '#content',                     // Подключаем к верхнему уровню
        data: {
            visible : true,                 // Общее фоновое размытие
            visible_start: true,            // Главное меню
            visible_end: false,             // Конечное меню
            message_show : false,           // Отображение сообщения
            message_content: "",            // Текст Сообщения
            time: "00:00",                  // Время
            raund : 0,                      // Раунд
            card : [false, false, false, false] // Свечение карт в массиве по индексу
        },
        methods:{
            //Тело таймера
            //Конвертируем секунды в приемлемый вид
            game_timer(){
                time++;
                let min = Math.floor(time / 60);
                let sec = time % 60;
                this.time = [
                    min.toString().padStart(2, '0'),
                    sec.toString().padStart(2, '0')
                ].join(':');
            },
            //Событие клика старта игры
            press_start_game(lev){
                is_game_render = true;
                this.shange_main_menu('hide');
                level = lev;
                game_array = [];
                time = 0;
                setTimeout(this.append_card, 1000);
                time_id = setInterval(main_con.game_timer, 1000);
            },
            //Возврат в главное меню
            press_restart() {
                this.shange_main_menu('start');
            },
            //Смена меню
            shange_main_menu(menu){
                this.visible = true;
                this.visible_start = false;
                this.visible_end = false;
                switch (menu) {
                    case 'start' : this.visible_start = true; break;
                    case 'end' : this.visible_end = true; break;
                    case 'hide' : this.visible = false;
                }
            },
            //Событие клика игроком по карте
            press_card(card){
                if(!is_game_render){
                    if(game_array[user_inpt_n] === card){
                        this.show_card(card);
                        user_inpt_n++;
                        const round = game_array.length;
                        if(user_inpt_n === round){
                            switch (round) {
                                case 3 : {this.show_messange("Уже 3, не плохо!")} break;
                                case 6 : {this.show_messange("Игра становиться напрежённой")} break;
                                case 9 : {this.show_messange("9 - это уже много!")} break;
                                case 12 :{this.show_messange("Комментарии излишни...")} break;
                            }
                            is_game_render = true;
                            setTimeout(this.append_card, 1000 * level_t[level] * 2);
                        }
                    }else{
                        clearTimeout(time_id);
                        this.raund = game_array.length;
                        this.shange_main_menu('end');
                    }
                }
            },
            // Добавить слуайную карту в колоду
            append_card(){
                is_game_render = true;
                game_array.push(this.get_round_card());
                this.render_for_user(0);
            },
            // Показать комбинацию карт
            render_for_user(state) {
                this.show_card(game_array[state]);
                state++;
                if (state < game_array.length) {
                    setTimeout(
                        this.render_for_user,
                        1000 * level_t[level],
                        state
                    )
                }else{
                    setTimeout(function () {
                        user_inpt_n = 0;
                        is_game_render = false
                    }, level_t[level]);
                }
            },
            // Отправить сообщение игроку
            show_messange(value) {
                this.message_show = true;
                this.message_content = value;
                setTimeout(function () {
                    main_con.message_show = false;
                }, 1000)
            },
            // Показть карту игроку
            show_card(card) {
                ausio_dom[card].currentTime = 0.0;
                ausio_dom[card].play(0);
                Vue.set(this.card, card, true);
                let time_h = is_game_render ? level_t[level] - 0.2 : 0.3;
                setTimeout(function () {
                    console.log('hide');
                    Vue.set(main_con.card, card, false);
                }, 1000 * time_h, card)
            },
            // Создать случайную карту
            get_round_card() {
                return Math.floor(Math.random() * (3 + 1));
            }
        }
    });
});