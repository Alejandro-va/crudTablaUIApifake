import React, {useState} from 'react'
import '../App.css';

const Tareas = (props) => {

  //borrar
  const borrarTareas = () =>{
    props.borrar(props.id)
  }

  //editar
  const [modoEdit, setModoEdit] = useState(false);
  const [editText, setEditText] =useState("");

const editar=()=>{
  setModoEdit(true)
}

  const handleEdit = (e) =>{
    setEditText(e.target.value)
  }

  const editForm =(e) =>{
    e.preventDefault()
    props.editar(props.id, editText)
    setEditText("");
    setModoEdit(false)
  }

  return (
    <div>
      {
        !modoEdit ?
      <div className="tareas">
        <span>{props.tasks}</span>
        <span className="accion"
        onClick={editar}> Editar</span> 
        <span className="accion" 
        onClick={borrarTareas}>Borrar</span>
      </div>
      :
      <form onSubmit={editForm}>
        <input 
        onChange={handleEdit}
              value={editText}
        />
        <button>editar</button>
      </form>
      }
    </div>
  )
}

export default Tareas
