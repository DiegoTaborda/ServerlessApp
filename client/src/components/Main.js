import React, { Component } from 'react';
// import { useState, useEffect } from "react";

import './Main.css';

export default class Main extends Component {
  state = {
    nome: "",
    email: "",
    endereco: "",
    data_nascimento: "",
  };



  adicionaPaciente = () => {
    const data = {
      pacienteId: String(Math.floor(Math.random()*10000)),
      nome: this.state.nome,
      endereco: this.state.endereco,
      email: this.state.email,
      data_nascimento: this.state.data_nascimento
    }

    fetch("https://fmry9o62x5.execute-api.sa-east-1.amazonaws.com/dev/paciente", {
      method: "POST",
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((data) => {
      console.log('Success:', data);
    }).catch((error) => {
      console.error('Error:', error);
    });

  }

  carregaPacientes = () => {
    fetch("https://fmry9o62x5.execute-api.sa-east-1.amazonaws.com/dev/pacientes")
    .then(response => response.json())
    .then(result => this.setState({resultado: [...result.data]}))
  }

  render() {

    return (
      <div className="teste">
        <div className="main">
          <h1>Adicionar paciente</h1>

          <form >

            <label>
              <p>Nome Completo</p>
              <input type="text" name="name" onChange={e => this.validaInput(e)}/>
            </label>

            <label>
              <p>Email</p>
              <input type="email" name="email" onChange={e => this.setState({email: e.target.value})}/>
            </label>

            <label>
              <p>Endereço</p>
              <input type="text" name="endereco" onChange={e => this.setState({endereco: e.target.value})}/>
            </label>

            <label>
              <p>Data de Nascimento</p>
              <input type="date" name="dt_nasc" onChange={e => this.setState({data_nascimento: e.target.value})}/>
            </label>

            <div className="erros">
            </div>

            <div>
              <button type="submit" onClick={this.adicionaPaciente}>Adicionar</button>
            </div>

          </form>


        </div>


      </div>
    )
  }
}

