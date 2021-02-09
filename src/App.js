import React, { useEffect, useState } from 'react';
import './App.css';
import { makeStyles, StylesProvider } from '@material-ui/core';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';

const baseUrl = 'http://localhost:3000/usuarios/'

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: 100,
    left: '50%',
    transform: 'translate(-50%, 50%)'
  },
  iconos: {
    cursor: 'pointer'
  },
  inputMaterial: {
    width: '100%'
  }
}));


function App() {
  const classes = useStyles();

  const [datos, setDatos] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState({
    nombre: "",
    apellidos: "",
    cargo: ""
  });

  //conectarse y cargar el API
  const peticionGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        console.log(response.data);
        setDatos(response.data)
      })
  }

  useEffect(() => {
    peticionGet();
  }, [])

  //Guardar en el API
  const peticionPost = async () => {
    await axios.post(baseUrl, usuarioSelecionado)
      .then(response => {
        setDatos(datos.concat(response.data))
        abrirCerrarModalInsertar()
      })
  }

  //Editar en el API
  const peticionesPUT = async () => {
    await axios.put(baseUrl + usuarioSelecionado.id, usuarioSelecionado)
      .then(response => {
        let dataNueva = datos
        console.log(dataNueva)
        dataNueva.map(users => {
          if (usuarioSelecionado.id === users.id) {
            users.nombre = usuarioSelecionado.nombre;
            users.apellidos = usuarioSelecionado.apellidos;
            users.cargo = usuarioSelecionado.cargo;
          }
          //return dataNueva
        })
        setDatos(dataNueva);
        abrirCerrarModalEdit()
      })
  }

  //Borrar Usuario
  const peticionesDelete = async () => {
    await axios.delete(baseUrl + usuarioSelecionado.id)
      .then(response => {
        setDatos(datos.filter(usuario => usuario.id !== usuarioSelecionado.id))
        abrirCerrarModalEliminar();
      })
  }

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEdit = () => {
    setModalEdit(!modalEdit);
  }

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }

  const seleccionarUsuario = (user, caso) => {
    setUsuarioSelecionado(user);
    (caso === 'Editar') ? abrirCerrarModalEdit() : abrirCerrarModalEliminar();
  }

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUsuarioSelecionado(
      prevUsuario => ({
        ...prevUsuario,
        [name]: value
      }))
  }
  console.log(usuarioSelecionado)

  const bodyInsertar = (
    <div className={classes.modal}>
      <h3>Agregar nuevo Usuario</h3>
      <TextField
        className={classes.inputMaterial}
        label="Nombre"
        onChange={handleChange}
        value={usuarioSelecionado.nombre}
        name="nombre"
      />
      <TextField
        className={classes.inputMaterial}
        label="Apellidos"
        onChange={handleChange}
        value={usuarioSelecionado.apellidos}
        name="apellidos"
      />
      <TextField
        className={classes.inputMaterial}
        label="Cargo"
        onChange={handleChange}
        value={usuarioSelecionado.cargo}
        name="cargo"
      />
      <div align="right">
        <Button color="primary"
          onClick={() => peticionPost()}>
          Insertar
          </Button>
        <Button color="default"
          onClick={() => abrirCerrarModalInsertar()}>
          Cancelar
          </Button>
      </div>
    </div>
  )

  const bodyEdit = (
    <div className={classes.modal}>
      <h3>Editar Usuarios</h3>
      <TextField
        className={classes.inputMaterial}
        label="Nombre"
        onChange={handleChange}
        value={usuarioSelecionado && usuarioSelecionado.nombre}
        name="nombre"
      />
      <TextField
        className={classes.inputMaterial}
        label="Apellidos"
        onChange={handleChange}
        value={usuarioSelecionado && usuarioSelecionado.apellidos}
        name="apellidos"
      />
      <TextField
        className={classes.inputMaterial}
        label="Cargo"
        onChange={handleChange}
        value={usuarioSelecionado && usuarioSelecionado.cargo}
        name="cargo"
      />
      <div align="right">
        <Button color="primary"
          onClick={() => peticionesPUT()}>
          Editar
          </Button>
        <Button color="default"
          onClick={() => abrirCerrarModalEdit()}>
          Cancelar
          </Button>
      </div>
    </div>
  )

  const bodyEliminar = (
    <div className={classes.modal}>
      <p>Estas seguro de eliminar este usuario? <b>{usuarioSelecionado && usuarioSelecionado.nombre}</b>?</p>
      <div align="right">
        <Button color="primary" onClick={() => peticionesDelete()}>
          Si
          </Button>
        <Button color="default"
          onClick={() => abrirCerrarModalEliminar()}>
          No
          </Button>
      </div>
    </div>
  )

  return (
    <div className="App">
      <br />
      <Button variant="contained" color="primary" onClick={() => abrirCerrarModalInsertar()}>
        Insertar
      </Button>
      <br />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellidos</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              datos.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>{user.apellidos}</TableCell>
                  <TableCell>{user.cargo}</TableCell>
                  <TableCell>
                    <Edit className={classes.iconos} onClick={() => seleccionarUsuario(user, 'Editar')} />
                    &nbsp; &nbsp; &nbsp;
                    <Delete className={classes.iconos} onClick={() => seleccionarUsuario(user, 'Eliminar')} />
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalInsertar}
        onClose={abrirCerrarModalInsertar}
      >
        {bodyInsertar}
      </Modal>

      <Modal
        open={modalEdit}
        onClose={abrirCerrarModalEdit}
      >
        {bodyEdit}
      </Modal>

      <Modal
        open={modalEliminar}
        onClose={abrirCerrarModalEliminar}
      >
        {bodyEliminar}
      </Modal>
    </div>
  );
}

export default App;
