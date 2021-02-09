import React, { useState } from 'react';
import '../App.css';

const TasksForm = (props) =>{
  const [inputText, setInputText] = useState("");
  const [validacion, setValidacion] = useState(true)

  const handleForm = (e) =>{
    setInputText(e.target.value)
  }

  const submit = (e) => {
    e.preventDefault();
    if(inputText.trim() !== ""){
    props.nuevaTarea(inputText)//paso mi props a imprimir
    setInputText("");//limpio el estado
    setValidacion(true)//valido la validacion
    }else{
    setValidacion(false)}
  }

  return (
    <div>
      <form className="form" onSubmit={submit}>
      <span>Add Tasks</span>
        <input 
        type="text"
        onChange={handleForm}
        value={inputText}
        name="task"
        />
        <button>Add Task</button>
    {
      !validacion &&
      <div className="validacion">Añada una tarea</div>
    }
      </form>

    </div>
  )
}

export default TasksForm
