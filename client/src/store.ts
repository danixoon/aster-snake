import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import createRootReducer from "./reducers";

import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";

// Объект, в котором находится начальное состояние всего хранилища Redux'а
const initialState = {};

// История браузера, которую можно использовать для переадресации по url без повторного рендеринга всего приложения
export const history = createBrowserHistory();

// Мидлвейры, подключаемые к Redux'у
//  Первый - redux-thunk, позволяющий делать асинхронные экшены и его расширение с доп. аргументом ws.emit,
//  для обработки веб-сокет запросов к серверу
//  --------------------------------------------
//  Второй - connected-react-router, позволяющий хранить данные об текущим url, переадресации и прочем в хранилище Redux, следовательно,
//  получать к этим данным удобный доступ внутри react-компонентов
const middleware = [thunk.withExtraArgument({}), routerMiddleware(history)];

// Функция, чтобы подрубить дев-расширение к приложению, которое вернёт энчансеры для последующего создания хранилища
const composeEnchanters = composeWithDevTools({ trace: true, traceLimit: 25 });

// Функция создания хранилища, в аргументах которой:
// - корневой редьюсер (тот, в котором подрублены все остальные)
// - начальное состояние хранилища
// - все подключенные мидлвейры и энчансеры
const store = createStore(createRootReducer(history), initialState, composeEnchanters(applyMiddleware(...middleware)));

// Привязываем хранилище к веб-сокетам, используя метод init, прописанный в файле websockets.js
// ws.init(store);

// Возвращаем созданное хранилище
export default store;
