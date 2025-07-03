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
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false, },
      nome: { type: Sequelize.STRING, allowNull: false, },
      id_tipo_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipo_usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE'
      },
      dt_nascimento: { type: Sequelize.DATEONLY, allowNull: true, },
      rg: { type: Sequelize.STRING, allowNull: true, },
      cpf: { type: Sequelize.STRING, allowNull: true, unique: true, },
      estado_civil: { type: Sequelize.STRING, allowNull: true, },
      sexo: { type: Sequelize.STRING, allowNull: true, },
      endereco: { type: Sequelize.STRING, allowNull: true, },
      num_endereco: { type: Sequelize.STRING, allowNull: true, },
      complemento: { type: Sequelize.STRING, allowNull: true, },
      cidade: { type: Sequelize.STRING, allowNull: true, },
      bairro: { type: Sequelize.STRING, allowNull: true, },
      cep: { type: Sequelize.STRING, allowNull: true, },
      naturalidade: { type: Sequelize.STRING, allowNull: true, },
      nacionalidade: { type: Sequelize.STRING, allowNull: true, },
      raca: { type: Sequelize.STRING, allowNull: true, },
      filhos: { type: Sequelize.INTEGER, allowNull: true, },
      telefone: { type: Sequelize.STRING, allowNull: true, },
      celular: { type: Sequelize.STRING, allowNull: true, },
      profissao: { type: Sequelize.STRING, allowNull: true, },
      local_trabalho: { type: Sequelize.STRING, allowNull: true, },
      email: { type: Sequelize.STRING, allowNull: false, unique: true, validate: { isEmail: true }, },
      senha: { type: Sequelize.STRING, allowNull: true, },
      instagram: { type: Sequelize.STRING, allowNull: true, },
      facebook: { type: Sequelize.STRING, allowNull: true, },
      ic_ativo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 1, },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), },
    });

    await queryInterface.createTable('usuario_anamneses', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      usuario_id: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onDelete: 'CASCADE'
      },

      // DADOS COMPLEMENTARES
      comp_trat_odon: { type: Sequelize.BOOLEAN, allowNull: true },
      comp_trat_odon_obs: { type: Sequelize.TEXT, allowNull: true },

      em_trat_medico: { type: Sequelize.BOOLEAN, allowNull: true },
      em_trat_medico_obs: { type: Sequelize.TEXT, allowNull: true },

      transfusao: { type: Sequelize.BOOLEAN, allowNull: true },
      transfusao_obs: { type: Sequelize.TEXT, allowNull: true },

      doenca_grave: { type: Sequelize.BOOLEAN, allowNull: true },
      doenca_grave_obs: { type: Sequelize.TEXT, allowNull: true },

      alergia_geral: { type: Sequelize.BOOLEAN, allowNull: true },
      alergia_geral_obs: { type: Sequelize.TEXT, allowNull: true },

      hospitalizado: { type: Sequelize.BOOLEAN, allowNull: true },
      hospitalizado_obs: { type: Sequelize.TEXT, allowNull: true },

      submetido_cirurgia: { type: Sequelize.BOOLEAN, allowNull: true },
      cirurgia_obs: { type: Sequelize.TEXT, allowNull: true },

      recebeu_anestesia: { type: Sequelize.BOOLEAN, allowNull: true },
      comp_anestesia: { type: Sequelize.BOOLEAN, allowNull: true },
      comp_anestesia_obs: { type: Sequelize.TEXT, allowNull: true },

      dor_dente: { type: Sequelize.BOOLEAN, allowNull: true },
      dor_dente_obs: { type: Sequelize.TEXT, allowNull: true },

      protese_cardiaca: { type: Sequelize.BOOLEAN, allowNull: true },
      protese_cardiaca_obs: { type: Sequelize.TEXT, allowNull: true },

      sangramento_anormal: { type: Sequelize.BOOLEAN, allowNull: true },
      sangramento_anormal_obs: { type: Sequelize.TEXT, allowNull: true },

      // ANAMNESE – SIM/NÃO para cada item
      tomando_medicamento: { type: Sequelize.BOOLEAN, allowNull: true },
      tomando_medicamento_obs: { type: Sequelize.TEXT, allowNull: true },
      // Lista fixa de condições (checkboxes)
      cond_diabetes: { type: Sequelize.BOOLEAN, allowNull: true },
      cond_dist_renais: { type: Sequelize.BOOLEAN, allowNull: true },
      cond_dormir: { type: Sequelize.BOOLEAN, allowNull: true },
      cond_coracao: { type: Sequelize.BOOLEAN, allowNull: true },
      cond_pressao: { type: Sequelize.BOOLEAN, allowNull: true },
      cond_ulcera: { type: Sequelize.BOOLEAN, allowNull: true },
      cond_alergia: { type: Sequelize.BOOLEAN, allowNull: true },
      cond_vitaminas: { type: Sequelize.BOOLEAN, allowNull: true },
      cond_hormonio: { type: Sequelize.BOOLEAN, allowNull: true },
      cond_anticoagulante: { type: Sequelize.BOOLEAN, allowNull: true },
      cond_sist_nervoso: { type: Sequelize.BOOLEAN, allowNull: true },
      cond_artrite: { type: Sequelize.BOOLEAN, allowNull: true },
      cond_anticonvulsivante: { type: Sequelize.BOOLEAN, allowNull: true },
      cond_dor_cabeca: { type: Sequelize.BOOLEAN, allowNull: true },

      // Alergia a algum medicamento?
      alergia_med: { type: Sequelize.BOOLEAN, allowNull: true },
      alergia_med_obs: { type: Sequelize.TEXT, allowNull: true },
      // Lista fixa de condições (checkboxes)
      alerg_penincilina: { type: Sequelize.BOOLEAN, allowNull: true },
      tomou_benzetacil: { type: Sequelize.BOOLEAN, allowNull: true },
      alerg_sulfa: { type: Sequelize.BOOLEAN, allowNull: true },
      tomou_bactrim: { type: Sequelize.BOOLEAN, allowNull: true },
      alerg_ass: { type: Sequelize.BOOLEAN, allowNull: true },
      alerg_anestesico_loc: { type: Sequelize.BOOLEAN, allowNull: true },

      // Pressão arterial – ENUM
      pressao_tipo: {
        type: Sequelize.ENUM('Baixa', 'Alta', 'Não sabe', 'Normal'),
        allowNull: true
      },

      // Sintomas (checkboxes)
      sint_dor_cabeca: { type: Sequelize.BOOLEAN, allowNull: true },
      sint_tontura: { type: Sequelize.BOOLEAN, allowNull: true },
      sint_nauseas: { type: Sequelize.BOOLEAN, allowNull: true },
      sint_dor_nuca: { type: Sequelize.BOOLEAN, allowNull: true },
      sint_palpitacoes: { type: Sequelize.BOOLEAN, allowNull: true },
      sint_zumbidos: { type: Sequelize.BOOLEAN, allowNull: true },
      sint_perda_memoria: { type: Sequelize.BOOLEAN, allowNull: true },
      sint_perda_equilibrio: { type: Sequelize.BOOLEAN, allowNull: true },

      // Perguntas específicas
      diabetico: { type: Sequelize.ENUM('SIM', 'NÃO', 'NÃO SABE'), allowNull: true },
      diab_familia: { type: Sequelize.BOOLEAN, allowNull: true },
      emagreceu: { type: Sequelize.BOOLEAN, allowNull: true },
      come_muito: { type: Sequelize.BOOLEAN, allowNull: true },
      urina_freq: { type: Sequelize.BOOLEAN, allowNull: true },
      muita_sede: { type: Sequelize.BOOLEAN, allowNull: true },

      prob_respiratorio: { type: Sequelize.BOOLEAN, allowNull: true },
      resp_asma: { type: Sequelize.BOOLEAN, allowNull: true },
      resp_bronquite: { type: Sequelize.BOOLEAN, allowNull: true },
      resp_tosse: { type: Sequelize.BOOLEAN, allowNull: true },
      resp_tb: { type: Sequelize.BOOLEAN, allowNull: true },

      prob_cardiaco: { type: Sequelize.ENUM('SIM', 'NÃO', 'NÃO SABE'), allowNull: true },
      card_dor_peito: { type: Sequelize.BOOLEAN, allowNull: true },
      card_dor_costas: { type: Sequelize.BOOLEAN, allowNull: true },
      card_cansa: { type: Sequelize.BOOLEAN, allowNull: true },
      card_arritmia: { type: Sequelize.BOOLEAN, allowNull: true },
      card_sopro: { type: Sequelize.BOOLEAN, allowNull: true },
      card_dorme_altura: { type: Sequelize.BOOLEAN, allowNull: true },
      card_incha_pe: { type: Sequelize.BOOLEAN, allowNull: true },

      // Demais SIM/NÃO fixos
      prob_articulacoes: { type: Sequelize.BOOLEAN, allowNull: true },
      gravida: { type: Sequelize.BOOLEAN, allowNull: true },
      anticoncepcional: { type: Sequelize.BOOLEAN, allowNull: true },
      sangra_facil: { type: Sequelize.BOOLEAN, allowNull: true },
      hemofilico: { type: Sequelize.BOOLEAN, allowNull: true },
      sinusite: { type: Sequelize.BOOLEAN, allowNull: true },
      prob_estomago: { type: Sequelize.BOOLEAN, allowNull: true },
      xerostomia: { type: Sequelize.BOOLEAN, allowNull: true },
      dengue: { type: Sequelize.BOOLEAN, allowNull: true },
      estressado: { type: Sequelize.BOOLEAN, allowNull: true },
      abriu_boca: { type: Sequelize.BOOLEAN, allowNull: true },
      autoimune: { type: Sequelize.BOOLEAN, allowNull: true },

      // Doenças específicas
      possui_HIV: { type: Sequelize.BOOLEAN, allowNull: true },
      leucemia: { type: Sequelize.BOOLEAN, allowNull: true },
      epilepsia: { type: Sequelize.BOOLEAN, allowNull: true },
      toma_anticoag: { type: Sequelize.BOOLEAN, allowNull: true },
      marca_passo: { type: Sequelize.BOOLEAN, allowNull: true },
      anemia: { type: Sequelize.ENUM('SIM', 'NÃO', 'NÃO SABE'), allowNull: true },

      // Hábitos
      vicio: { type: Sequelize.BOOLEAN, allowNull: true },
      fuma: { type: Sequelize.BOOLEAN, allowNull: true },
      bebe: { type: Sequelize.BOOLEAN, allowNull: true },
      range_dentes: { type: Sequelize.BOOLEAN, allowNull: true },
      aperta_dentes: { type: Sequelize.BOOLEAN, allowNull: true },
      usa_palito: { type: Sequelize.BOOLEAN, allowNull: true },

      usa_drogas: { type: Sequelize.BOOLEAN, allowNull: true },
      usa_drogas_obs: { type: Sequelize.TEXT, allowNull: true },

      // Genito-urinário
      gu_problema: { type: Sequelize.BOOLEAN, allowNull: true },
      gu_insuficiencia: { type: Sequelize.BOOLEAN, allowNull: true },
      gu_calculo: { type: Sequelize.BOOLEAN, allowNull: true },
      gu_infeccao: { type: Sequelize.BOOLEAN, allowNull: true },
      gu_doenca_venerea: { type: Sequelize.BOOLEAN, allowNull: true },

      hepa: { type: Sequelize.ENUM('SIM', 'NÃO', 'NÃO SABE'), allowNull: true },
      hepa_obs: { type: Sequelize.TEXT, allowNull: true },

      outra_doenca: { type: Sequelize.ENUM('SIM', 'NÃO', 'NÃO SABE'), allowNull: true },
      diarreia_cronica: { type: Sequelize.BOOLEAN, allowNull: true },
      febre_const: { type: Sequelize.BOOLEAN, allowNull: true },
      sudorese: { type: Sequelize.BOOLEAN, allowNull: true },
      aperta_dentes: { type: Sequelize.BOOLEAN, allowNull: true },
      cancer_pele: { type: Sequelize.BOOLEAN, allowNull: true },
      diabetes_desc: { type: Sequelize.BOOLEAN, allowNull: true },
      probl_cicatriz: { type: Sequelize.BOOLEAN, allowNull: true },
      doenca_cont: { type: Sequelize.BOOLEAN, allowNull: true },
      baixa_imun: { type: Sequelize.BOOLEAN, allowNull: true },
      dermatite: { type: Sequelize.BOOLEAN, allowNull: true },

      familia_info: { type: Sequelize.TEXT, allowNull: true },

      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('usuario_exames_complementares', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      usuario_id: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onDelete: 'CASCADE'
      },
      peso: { type: Sequelize.DECIMAL(5, 2), allowNull: true },
      data_peso: { type: Sequelize.DATEONLY, allowNull: true },
      tipo_sanguineo: { type: Sequelize.STRING, allowNull: true },
      pressao: { type: Sequelize.STRING, allowNull: true },
      data_pressao: { type: Sequelize.DATEONLY, allowNull: true },

      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('usuario_exames_complementares');
    await queryInterface.dropTable('usuario_anamneses');
    await queryInterface.dropTable('usuarios');
    await queryInterface.dropTable('tipo_usuarios');
  }
};
