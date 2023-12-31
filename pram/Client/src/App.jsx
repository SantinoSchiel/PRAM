import { useEffect, useState } from "react";
import "./App.css";
import Cards from "./components/cards/Cards.jsx";
import Nav from "./components/nav/Nav.jsx";
import axios from "axios";
// const URL = "https://rym2.up.railway.app/api/character";
// const API_KEY = "henrystaff";
// `${URL}/${id}?key=${API_KEY}`
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import About from "./components/about/About.jsx";
import Detail from "./components/detail/Detail.jsx";
import Form from "./components/form/Form.jsx";
import Error from "./components/error/Error.jsx";
import Favorites from "./components/favorites/Favorites.jsx"
import { useDispatch } from "react-redux";
import { removeFav } from "./redux/actions.js";

function App() {
   const dispatch = useDispatch();

   const [characters, setCharacters] = useState([]);
   //? Creamos el estado characters iniciandolo como un arreglo vacio.

   const location = useLocation();
   //? Le asignamos a la constante location la funcion useLocation, con esta podremos saber donde estamos ubicados
   //? en el navegador.

   const navigate = useNavigate();
   //? Con este hook podremos navegar/redirigir dentro de la pagina.

   const [access, setAccess] = useState(false);
   //? Creamos el estado access dandole como valor inicial false (es decir no estara logueado).

   // const email = "ruso@gmail.com";
   // const password = "123";
   
   const login = async (userData) => {
      try {
         const { email, password } = userData;

         const URL = 'http://localhost:3001/rickandmorty/login/';

         const {data} = await axios(URL + `?email=${email}&password=${password}`);

         const { access } = data;

         if(access) {
            setAccess(data);
            access && navigate('/home');
         } else {
            alert('Credenciales incorrectas')
         }
      } catch (error) {
         return res.status(500).send({ error: error.message })
      }
   }

   function logout() {
      setAccess(false)
   }
   //? esta funcion simplemente setea el estado access en false y por lo tanto estaras deslogueado y te dirigira
   //? a la ruta de logueo.

   useEffect(() => {
      !access && navigate('/');
   }, [access]);
   //? Lo que hace esta funcion es que si no tienes access te envia a la ruta de logueo.

   const onSearch = async (id) => {
      const charId = characters.filter(char => char.id === Number(id))
      if (charId.length) {
         return alert(`${charId[0].name} ya existe!`)
      }
      try {
         const {data} = await axios(`http://localhost:3001/rickandmorty/character/${id}`)

         if (data.name) {
            setCharacters((oldChars) => [...oldChars, data]);
         } else {
            window.alert('¡No hay personajes con este ID!');
         }
      } catch (error) {
         return res.status(500).send({ error: error.message });
      }
   }
   //? Esta funcion solicita los datos a la url donde estan almacenados, lo primero que hace es filtrar el character
   //? que quieras agregar y ver si ya esta agregado, en esta caso te mostrara una alarta.
   //? Luego seteara el estado de characters agregando el pj que quieras siempre y cuando pase la primer condicion,
   //? y en caso de que ingreses un id no valido te muestra una alerta.

   const onClose = (id) => {
      setCharacters( (characters) => characters.filter(char => char.id !== Number(id)));
      dispatch(removeFav(id));
   }
   //? Esta funcion recibe un id, entonces seteara el estado characters filtrando el id recibido con el id del
   //? pj a eliminar y devolvera un arreglo sin ese pj, y por ultimo despachara la accion removeFav con ese id
   //? para eliminarlo de la lista de favoritos.

   const closeAll = () => {
      setCharacters([])
   };

   return (
      <div className='App'>
         {location.pathname === '/' ? null : <Nav onSearch={onSearch} logout={logout} closeAll={closeAll}/>}
         <Routes>
            <Route path="/" element={<Form login={login} />} />
            <Route path="/home" element={<Cards characters={characters} onClose={onClose} />} />
            <Route path="/about" element={<About />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/favorites" element={<Favorites onClose={onClose}/>}/>
            <Route path="*" element={<Error />} />
         </Routes>
      </div>
      //? En este return decimos que si estoy en la direccion "/", osea el login, no muestre la barra para navegar
      //? de lo contrario que si la muestre, esto para que tengas que loguearte para poder navegar por la pagina.
      //? Una vez logueado podras ver la barra de navegacion y sera posible dirigirse a donde quieras.
   );
}

export default App;