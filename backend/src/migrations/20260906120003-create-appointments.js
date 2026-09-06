export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("appointments", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      primaryKey: true,
      allowNull: false,
    },
    patientName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    patientContact: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    doctorId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "doctors",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    dateTime: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    reason: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Pending",
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  await queryInterface.addIndex("appointments", ["doctorId", "dateTime"], {
    name: "appointments_doctor_datetime_idx",
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("appointments");
}
