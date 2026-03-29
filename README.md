# Web API - Gestão de Barcos

## Descrição

Este projeto consiste no desenvolvimento de uma **Web API em Node.js** para gestão de reservas de barcos por marinheiros.

A API permite:

* Gestão de marinheiros
* Gestão de barcos
* Criação e gestão de reservas
_________________________________________________________________________________________________________________________

## Tecnologias utilizadas

* Node.js
* Express.js
* Oracle Database
* Postman
_________________________________________________________________________________________________________________________

## Estrutura do projeto

```
api-barcos/
│
├── controllers/
├── routes/
├── models/
├── database/
├── app.js
├── middleware.js
├── package.json
```
_________________________________________________________________________________________________________________________

## Como executar o projeto

1. Instalar dependências:

```
npm install
```

2. Executar o servidor:

```
node app.js
```

3. A API ficará disponível em:

```
http://localhost:8080
```
_________________________________________________________________________________________________________________________

## Endpoints

### Marinheiros

* **POST** `/api/marinheiros`
  Criar marinheiro

* **GET** `/api/marinheiros`
  Listar todos os marinheiros

* **GET** `/api/marinheiros/classificacao?classificacao=X`
  Filtrar por classificação

* **GET** `/api/marinheiros/:id`
  Obter marinheiro por ID

* **PATCH** `/api/marinheiros/:id`
  Atualizar classificação

* **DELETE** `/api/marinheiros/:id`
  Eliminar marinheiro (se não tiver reservas)

---

### Barcos

* **POST** `/api/barcos`
  Criar barco

* **GET** `/api/barcos`
  Listar barcos

* **GET** `/api/barcos/disponiveis`
  Listar barcos disponíveis para reserva

---

### Reservas

* **POST** `/api/reservas`
  Criar reserva

* **GET** `/api/reservas/marinheiro/:id`
  Listar reservas de um marinheiro

* **DELETE** `/api/reservas`
  Cancelar reserva futura
_________________________________________________________________________________________________________________________

## Regras implementadas

* Um marinheiro só pode ser eliminado se não tiver reservas associadas;
* Apenas reservas futuras podem ser canceladas;
* Barcos disponíveis são aqueles que não estão associados a reservas;
* As reservas são identificadas por chave composta:

  * id_marinheiro
  * id_barco
  * data
_________________________________________________________________________________________________________________________

## Testes

Os testes foram realizados utilizando o **Postman**, organizados em coleções por entidade:

* Marinheiros
* Barcos
* Reservas
_________________________________________________________________________________________________________________________

## Notas
* O foco do projeto é a implementação das funcionalidades (histórias de uso) e interação com a base de dados.
* A API não implementa autenticação nem autorização.
  Assumimos que o sistema prevê diferentes tipos de utilizadores e serviços específicos para cada um deles:
  * Gestor: gere utilizadores, perfis de utilizador e barcos;
  * Marinheiro: consulta barcos disponíveis e gere as suas reservas de barcos.
_________________________________________________________________________________________________________________________

## Autor

Catarina Soares - 902508016 | UP25T08 – Desenvolvimento Web – PL/SQL
