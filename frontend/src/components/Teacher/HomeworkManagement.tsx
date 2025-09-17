import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface HomeworkItem {
  _id: string;
  title: string;
  description: string;
  subject: string;
  assignedDate: string;
  dueDate: string;
  totalMarks?: number;
  status: 'Active' | 'Completed' | 'Expired';
}

const HomeworkManagement: React.FC = () => {
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    totalMarks: ''
  });

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const fetchHomeworks = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since we don't have a getHomeworks API for teachers
      setHomeworks([]);
    } catch (err: any) {
      setError('Failed to fetch homework assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subject.trim() || !formData.dueDate) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const homeworkData = {
        ...formData,
        totalMarks: formData.totalMarks ? parseInt(formData.totalMarks) : undefined,
        assignedDate: new Date().toISOString().split('T')[0]
      };

      await teacherAPI.createHomework(homeworkData);
      setSuccess('Homework assignment created successfully!');
      setFormData({
        title: '',
        description: '',
        subject: '',
        dueDate: '',
        totalMarks: ''
      });
      setShowForm(false);
      fetchHomeworks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create homework assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Completed': return '#3b82f6';
      case 'Expired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return React.createElement('div', { 
      style: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      } 
    }, 'Loading homework assignments...');
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
        React.createElement('h3', { style: { color: '#10b981', margin: '0' } }, 'Homework Management'),
        React.createElement('button', {
          onClick: () => setShowForm(!showForm),
          style: {
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }
        }, showForm ? 'Cancel' : '+ Create Assignment')
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

    // Create Homework Form
    showForm && React.createElement('div', { 
      style: { 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }
    },
      React.createElement('h4', { style: { marginBottom: '20px' } }, 'Create New Assignment'),
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('div', { 
          style: { 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '15px',
            marginBottom: '15px'
          }
        },
          React.createElement('div', null,
            React.createElement('label', { 
              style: { 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500' 
              } 
            }, 'Title *'),
            React.createElement('input', {
              type: 'text',
              name: 'title',
              placeholder: 'Assignment title',
              value: formData.title,
              onChange: handleInputChange,
              required: true,
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
            }, 'Subject *'),
            React.createElement('input', {
              type: 'text',
              name: 'subject',
              placeholder: 'Subject name',
              value: formData.subject,
              onChange: handleInputChange,
              required: true,
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
            }, 'Due Date *'),
            React.createElement('input', {
              type: 'date',
              name: 'dueDate',
              value: formData.dueDate,
              onChange: handleInputChange,
              min: new Date().toISOString().split('T')[0],
              required: true,
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
            }, 'Total Marks'),
            React.createElement('input', {
              type: 'number',
              name: 'totalMarks',
              placeholder: '100',
              min: '1',
              value: formData.totalMarks,
              onChange: handleInputChange,
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
          }, 'Description'),
          React.createElement('textarea', {
            name: 'description',
            placeholder: 'Assignment details and instructions...',
            value: formData.description,
            onChange: handleInputChange,
            rows: 4,
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
            onClick: () => setShowForm(false),
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
          }, submitting ? 'Creating...' : 'Create Assignment')
        )
      )
    ),

    // Homework List
    React.createElement('div', { 
      style: { 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }
    },
      React.createElement('h4', { style: { marginBottom: '15px' } }, 'Recent Assignments'),
      homeworks.length === 0 ? 
        React.createElement('div', { 
          style: { 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280' 
          }
        },
          React.createElement('div', { style: { fontSize: '48px', marginBottom: '10px' } }, '📚'),
          React.createElement('div', { style: { fontSize: '18px', marginBottom: '5px' } }, 'No assignments yet'),
          React.createElement('div', { style: { fontSize: '14px' } }, 'Create your first homework assignment using the button above')
        ) :
        React.createElement('div', { 
          style: { 
            display: 'grid', 
            gap: '15px' 
          }
        },
          ...homeworks.map(homework =>
            React.createElement('div', { 
              key: homework._id,
              style: { 
                padding: '20px', 
                borderRadius: '8px',
                backgroundColor: '#fafafa',
                border: '1px solid #e5e7eb'
              }
            },
              React.createElement('div', { 
                style: { 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '10px'
                }
              },
                React.createElement('div', null,
                  React.createElement('h5', { 
                    style: { 
                      fontSize: '16px', 
                      fontWeight: '600',
                      marginBottom: '5px'
                    } 
                  }, homework.title),
                  React.createElement('div', { 
                    style: { 
                      fontSize: '14px', 
                      color: '#6b7280',
                      marginBottom: '5px' 
                    } 
                  }, `Subject: ${homework.subject}`)
                ),
                React.createElement('span', { 
                  style: { 
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: getStatusColor(homework.status) + '20',
                    color: getStatusColor(homework.status)
                  }
                }, homework.status)
              ),
              homework.description && React.createElement('p', { 
                style: { 
                  color: '#4b5563',
                  marginBottom: '10px'
                } 
              }, homework.description),
              React.createElement('div', { 
                style: { 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#6b7280'
                }
              },
                React.createElement('div', null, 
                  `Assigned: ${new Date(homework.assignedDate).toLocaleDateString()}`
                ),
                React.createElement('div', null, 
                  `Due: ${new Date(homework.dueDate).toLocaleDateString()}`
                ),
                homework.totalMarks && React.createElement('div', null, 
                  `Total Marks: ${homework.totalMarks}`
                )
              )
            )
          )
        )
    )
  );
};

export default HomeworkManagement;