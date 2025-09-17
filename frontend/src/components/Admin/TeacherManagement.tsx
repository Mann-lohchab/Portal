import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

interface Teacher {
  _id: string;
  teacherID: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  subjects?: string[];
  joiningDate?: string;
}

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    teacherID: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    subjects: '',
    joiningDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getTeachers();
      setTeachers(Array.isArray(data) ? data : data.teachers || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.teacherID.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return React.createElement('div', { 
      style: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      } 
    }, 'Loading teachers...');
  }

  return React.createElement('div', null,
    React.createElement('div', { 
      style: { 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }
    },
      React.createElement('div', { 
        style: { 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }
      },
        React.createElement('h3', { style: { color: '#10b981', margin: '0' } }, 'Teacher Management'),
        React.createElement('button', {
          onClick: () => {
            setShowAddForm(true);
            setEditingTeacher(null);
            setFormData({
              teacherID: '',
              firstName: '',
              lastName: '',
              email: '',
              address: '',
              subjects: '',
              joiningDate: new Date().toISOString().split('T')[0]
            });
          },
          style: {
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }
        }, '+ Add Teacher')
      ),

      // Search
      React.createElement('div', { style: { marginBottom: '20px' } },
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search teachers...',
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          style: {
            width: '100%',
            maxWidth: '400px',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }
        })
      ),

      // Status messages
      error && React.createElement('div', { 
        style: { 
          color: '#dc2626', 
          backgroundColor: '#fee2e2',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px'
        } 
      }, error),
      
      success && React.createElement('div', { 
        style: { 
          color: '#059669', 
          backgroundColor: '#d1fae5',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px'
        } 
      }, success)
    ),

    // Add/Edit Teacher Form
    showAddForm && React.createElement('div', { 
      style: { 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }
    },
      React.createElement('h4', { style: { marginBottom: '20px' } }, 
        editingTeacher ? 'Edit Teacher' : 'Add New Teacher'
      ),
      React.createElement('form', { 
        onSubmit: async (e) => {
          e.preventDefault();
          if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
            setError('Please fill in all required fields');
            return;
          }
          try {
            setSubmitting(true);
            setError(null);
            setSuccess(null);
            const teacherData = {
              ...formData,
              subjects: formData.subjects ? formData.subjects.split(',').map(s => s.trim()) : []
            };
            if (editingTeacher) {
              await adminAPI.updateTeacher(editingTeacher._id, teacherData);
              setSuccess('Teacher updated successfully!');
            } else {
              await adminAPI.createTeacher(teacherData);
              setSuccess('Teacher created successfully!');
            }
            setShowAddForm(false);
            fetchTeachers();
          } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save teacher');
          } finally {
            setSubmitting(false);
          }
        }
      },
        React.createElement('div', { 
          style: { 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '15px',
            marginBottom: '15px'
          }
        },
          ['firstName', 'lastName', 'email', 'teacherID'].map(field =>
            React.createElement('div', { key: field },
              React.createElement('label', { 
                style: { 
                  display: 'block', 
                  marginBottom: '5px', 
                  fontWeight: '500',
                  textTransform: 'capitalize'
                } 
              }, field.replace(/([A-Z])/g, ' $1') + (field !== 'teacherID' ? ' *' : '')),
              React.createElement('input', {
                type: field === 'email' ? 'email' : 'text',
                placeholder: `Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
                value: formData[field as keyof typeof formData],
                onChange: (e) => setFormData({ ...formData, [field]: e.target.value }),
                required: field !== 'teacherID',
                style: {
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }
              })
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { 
              style: { 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500' 
              } 
            }, 'Subjects'),
            React.createElement('input', {
              type: 'text',
              placeholder: 'Math, Science, English (comma separated)',
              value: formData.subjects,
              onChange: (e) => setFormData({ ...formData, subjects: e.target.value }),
              style: {
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { 
              style: { 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500' 
              } 
            }, 'Joining Date'),
            React.createElement('input', {
              type: 'date',
              value: formData.joiningDate,
              onChange: (e) => setFormData({ ...formData, joiningDate: e.target.value }),
              style: {
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }
            })
          )
        ),
        React.createElement('div', { style: { marginBottom: '15px' } },
          React.createElement('label', { 
            style: { 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '500' 
            } 
          }, 'Address'),
          React.createElement('textarea', {
            placeholder: 'Enter address',
            value: formData.address,
            onChange: (e) => setFormData({ ...formData, address: (e.target as HTMLTextAreaElement).value }),
            rows: 3,
            style: {
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical'
            }
          })
        ),
        React.createElement('div', { 
          style: { 
            display: 'flex', 
            gap: '10px', 
            justifyContent: 'flex-end' 
          }
        },
          React.createElement('button', {
            type: 'button',
            onClick: () => setShowAddForm(false),
            style: {
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer'
            }
          }, 'Cancel'),
          React.createElement('button', {
            type: 'submit',
            disabled: submitting,
            style: {
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1
            }
          }, submitting ? 'Saving...' : (editingTeacher ? 'Update Teacher' : 'Add Teacher'))
        )
      )
    ),

    React.createElement('div', { 
      style: { 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }
    },
      React.createElement('div', { 
        style: { 
          marginBottom: '15px',
          color: '#6b7280',
          fontSize: '14px'
        }
      }, `Showing ${filteredTeachers.length} of ${teachers.length} teachers`),
      
      filteredTeachers.length === 0 ? 
        React.createElement('div', { 
          style: { 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280' 
          }
        },
          React.createElement('div', { style: { fontSize: '48px', marginBottom: '10px' } }, '👩‍🏫'),
          React.createElement('div', { style: { fontSize: '18px', marginBottom: '5px' } }, 'No teachers found'),
          React.createElement('div', { style: { fontSize: '14px' } }, searchTerm ? 'Try adjusting your search terms' : 'Add teachers to get started')
        ) :
        React.createElement('div', { 
          style: { 
            display: 'grid', 
            gap: '15px' 
          }
        },
          // Header
          React.createElement('div', { 
            style: { 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr 1fr auto',
              gap: '15px',
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '14px',
              color: '#374151'
            }
          },
            React.createElement('div', null, 'Teacher Information'),
            React.createElement('div', { style: { textAlign: 'center' } }, 'Teacher ID'),
            React.createElement('div', { style: { textAlign: 'center' } }, 'Contact'),
            React.createElement('div', { style: { textAlign: 'center' } }, 'Actions')
          ),
          
          // Teacher rows
          ...filteredTeachers.map(teacher =>
            React.createElement('div', { 
              key: teacher._id,
              style: { 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr 1fr auto',
                gap: '15px',
                padding: '15px',
                backgroundColor: '#fafafa',
                borderRadius: '6px',
                alignItems: 'center',
                transition: 'background-color 0.2s ease'
              }
            },
              React.createElement('div', null,
                React.createElement('div', { style: { fontWeight: '500', marginBottom: '4px' } }, 
                  `${teacher.firstName} ${teacher.lastName}`
                ),
                teacher.subjects && teacher.subjects.length > 0 && React.createElement('div', { 
                  style: { 
                    fontSize: '12px', 
                    color: '#6b7280',
                    marginBottom: '2px' 
                  } 
                }, `Subjects: ${teacher.subjects.join(', ')}`),
                teacher.joiningDate && React.createElement('div', { 
                  style: { 
                    fontSize: '11px', 
                    color: '#6b7280'
                  } 
                }, `Joined: ${new Date(teacher.joiningDate).toLocaleDateString()}`)
              ),
              React.createElement('div', { 
                style: { 
                  textAlign: 'center',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  fontWeight: '500'
                } 
              }, teacher.teacherID),
              React.createElement('div', { 
                style: { 
                  fontSize: '12px', 
                  color: '#6b7280',
                  textAlign: 'center'
                } 
              },
                React.createElement('div', { style: { marginBottom: '2px' } }, teacher.email),
                teacher.address && React.createElement('div', { 
                  style: { 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '120px'
                  } 
                }, teacher.address)
              ),
              React.createElement('div', { 
                style: { 
                  display: 'flex', 
                  gap: '8px' 
                }
              },
                React.createElement('button', {
                  onClick: () => {
                    setEditingTeacher(teacher);
                    setFormData({
                      teacherID: teacher.teacherID,
                      firstName: teacher.firstName,
                      lastName: teacher.lastName,
                      email: teacher.email,
                      address: teacher.address,
                      subjects: teacher.subjects ? teacher.subjects.join(', ') : '',
                      joiningDate: teacher.joiningDate ? teacher.joiningDate.split('T')[0] : new Date().toISOString().split('T')[0]
                    });
                    setShowAddForm(true);
                  },
                  style: {
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }
                }, 'Edit'),
                React.createElement('button', {
                  onClick: async () => {
                    if (window.confirm(`Are you sure you want to delete ${teacher.firstName} ${teacher.lastName}?`)) {
                      try {
                        await adminAPI.deleteTeacher(teacher._id);
                        setSuccess('Teacher deleted successfully!');
                        fetchTeachers();
                      } catch (err: any) {
                        setError(err.response?.data?.message || 'Failed to delete teacher');
                      }
                    }
                  },
                  style: {
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }
                }, 'Delete')
              )
            )
          )
        )
    )
  );
};

export default TeacherManagement;