'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {


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
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      genero: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      nivel: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      matricula: {
        type: Sequelize.STRING,
        unique: true,
      },
      experiencia: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      id_avatar: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'avatares',
          key: 'id',
        },
        onUpdate: 'CASCADE'
      },
      id_turma: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'turmas',
          key: 'id',
        },
        onUpdate: 'CASCADE'
      },
      id_escola: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'escolas',
          key: 'id',
        },
        onUpdate: 'CASCADE'
      },
      tipo_usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipo_usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE'
      },
      id_materia: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'materias',
          key: 'id',
        },
        onUpdate: 'CASCADE'
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

     

    await queryInterface.createTable('elo_materias', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      materia_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'materias',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      elo_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'elos',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      subelo_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'subelos',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: true,
      },
      respostas_corretas_elo: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      respostas_corretas_total: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
      unique_elo_per_usuario_materia: {
        type: Sequelize.STRING,
        unique: true,
      }
    });
    
    

  },

  async down (queryInterface, Sequelize) {
    // Remover tabelas na ordem inversa da criação
    await queryInterface.dropTable('elo_materias');
    await queryInterface.dropTable('usuarios');
    await queryInterface.dropTable('tipo_usuarios');
  }
};
