const { sequelize, User, Project, Task } = require('./models');

async function testDatabase() {
  try {
    // 1. Verify connection and tables
    await sequelize.authenticate();
    console.log('✅ Connection to MySQL successful.');
    
    // Check if tables exist
    const [results] = await sequelize.query('SHOW TABLES;');
    console.log('✅ Tables in database:', results.map(r => Object.values(r)[0]).join(', '));

    // 2. Insert Test Data
    console.log('\n--- Inserting Test Data ---');
    
    // Create User
    const testUser = await User.create({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'MEMBER'
    });
    console.log('✅ User created:', testUser.id, testUser.email);

    // Create Project
    const testProject = await Project.create({
      name: 'Test Project',
      description: 'A project for testing Sequelize',
      createdById: testUser.id
    });
    console.log('✅ Project created:', testProject.id, testProject.name);

    // Add User to Project (Many-to-Many association test)
    await testProject.addMember(testUser);
    console.log('✅ User added to Project Members.');

    // Create Task
    const testTask = await Task.create({
      title: 'Test Task',
      description: 'Verify associations',
      status: 'Todo',
      projectId: testProject.id,
      assignedToId: testUser.id,
      dueDate: new Date()
    });
    console.log('✅ Task created:', testTask.id, testTask.title);

    // 3. Query Data (Testing Associations)
    console.log('\n--- Querying Data (Associations) ---');
    
    const userWithProjects = await User.findByPk(testUser.id, {
      include: {
        model: Project,
        as: 'projects',
        include: [
          { model: User, as: 'createdBy', attributes: ['id', 'name'] },
          { model: User, as: 'members', attributes: ['id', 'name'] }
        ]
      }
    });
    
    console.log('✅ Queried User with Projects:', JSON.stringify({
      user: userWithProjects.name,
      projects: userWithProjects.projects.map(p => ({
        name: p.name,
        creator: p.createdBy.name,
        members: p.members.map(m => m.name)
      }))
    }, null, 2));

    const projectWithTasks = await Project.findByPk(testProject.id, {
      include: [
        { model: Task, as: 'tasks' }
      ]
    });
    
    console.log('✅ Queried Project with Tasks:', JSON.stringify({
      project: projectWithTasks.name,
      tasks: projectWithTasks.tasks.map(t => t.title)
    }, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testDatabase();
