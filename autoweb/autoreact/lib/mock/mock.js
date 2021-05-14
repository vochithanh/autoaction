function mockFetch() {
  const t1 = {
    data: {
      name: 'Task 1',
      id: 1
    }
  };
  const t2 = {
    data: {
      name: 'Task 2',
      id: 2
    }
  };
  const p1 = {
    data: {
      name: 'Project 1',
      id: 1
    },
    tasks: [t1, t2]
  };
  const p2 = {
    data: {
      name: 'Project 2',
      id: 2
    },
    tasks: [t1, t2]
  };
  return {
    workspace: {
      projects: [p1, p2],
      title: 'Auto Action workspace'
    }
  };
}