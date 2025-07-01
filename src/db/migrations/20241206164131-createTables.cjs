'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {


    await queryInterface.createTable('tipo_usuarios', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Tabela de usuários
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_tipo_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipo_usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE'
      },
      dt_nascimento: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      rg: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      estado_civil: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sexo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      endereco: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      num_endereco: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      complemento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cidade: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bairro: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cep: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      naturalidade: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nacionalidade: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      raca: {
        type: Sequelize.STRING,
        allowNull: true,
      },
       filhos: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      
      telefone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      celular: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profissao: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      local_trabalho: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      instagram: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      facebook: {
        type: Sequelize.STRING,
        allowNull: true,
      },
       ic_ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
    await queryInterface.dropTable('tipo_usuarios');
  }
};
