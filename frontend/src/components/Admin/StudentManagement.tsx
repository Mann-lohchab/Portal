import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

interface Student {
  _id: string;
  studentID: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: number;
  fathersName: string;
  mothersName: string;
  address: string;
}

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentID: '',
    firstName: '',
    lastName: '',
    email: '',
    grade: '1',
    fathersName: '',
    mothersName: '',
    address: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getStudents();
      setStudents(Array.isArray(data) ? data : data.students || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentID.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === '' || student.grade.toString() === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  if (loading) {
    return React.createElement('div', { 
      style: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      } 
    }, 'Loading students...');
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
        React.createElement('h3', { style: { color: '#3b82f6', margin: '0' } }, 'Student Management'),
        React.createElement('button', {
          onClick: () => {
            setShowAddForm(true);
            setEditingStudent(null);
            setFormData({
              studentID: '',
              firstName: '',
              lastName: '',
              email: '',
              grade: '1',
              fathersName: '',
              mothersName: '',
              address: ''
            });
          },
          style: {
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }
        }, '+ Add Student')
      ),

      // Search and Filter
      React.createElement('div', { 
        style: { 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginBottom: '20px'
        }
      },
        React.createElement('div', null,
          React.createElement('input', {
            type: 'text',
            placeholder: 'Search students...',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            style: {
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }
          })
        ),
        React.createElement('div', null,
          React.createElement('select', {
            value: selectedGrade,
            onChange: (e) => setSelectedGrade((e.target as HTMLSelectElement).value),
            style: {
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }
          },
            React.createElement('option', { value: '' }, 'All Grades'),
            ...Array.from({length: 12}, (_, i) => i + 1).map(grade =>
              React.createElement('option', { key: grade, value: grade.toString() }, `Grade ${grade}`)
            )
          )
        )
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

    // Add/Edit Student Form
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
        editingStudent ? 'Edit Student' : 'Add New Student'
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
            if (editingStudent) {
              await adminAPI.updateStudent(editingStudent._id, formData);
              setSuccess('Student updated successfully!');
            } else {
              await adminAPI.createStudent(formData);
              setSuccess('Student created successfully!');
            }
            setShowAddForm(false);
            fetchStudents();
          } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save student');
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
          ['firstName', 'lastName', 'email', 'studentID'].map(field =>
            React.createElement('div', { key: field },
              React.createElement('label', { 
                style: { 
                  display: 'block', 
                  marginBottom: '5px', 
                  fontWeight: '500',
                  textTransform: 'capitalize'
                } 
              }, field.replace(/([A-Z])/g, ' $1') + (field !== 'studentID' ? ' *' : '')),
              React.createElement('input', {
                type: field === 'email' ? 'email' : 'text',
                placeholder: `Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
                value: formData[field as keyof typeof formData],
                onChange: (e) => setFormData({ ...formData, [field]: e.target.value }),
                required: field !== 'studentID',
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
            }, 'Grade *'),
            React.createElement('select', {
              value: formData.grade,
              onChange: (e) => setFormData({ ...formData, grade: (e.target as HTMLSelectElement).value }),
              required: true,
              style: {
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }
            },
              ...Array.from({length: 12}, (_, i) => i + 1).map(grade =>
                React.createElement('option', { key: grade, value: grade.toString() }, `Grade ${grade}`)
              )
            )
          ),
          ['fathersName', 'mothersName'].map(field =>
            React.createElement('div', { key: field },
              React.createElement('label', { 
                style: { 
                  display: 'block', 
                  marginBottom: '5px', 
                  fontWeight: '500' 
                } 
              }, field.replace(/([A-Z])/g, ' $1')),
              React.createElement('input', {
                type: 'text',
                placeholder: `Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
                value: formData[field as keyof typeof formData],
                onChange: (e) => setFormData({ ...formData, [field]: e.target.value }),
                style: {
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }
              })
            )
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
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1
            }
          }, submitting ? 'Saving...' : (editingStudent ? 'Update Student' : 'Add Student'))
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
      }, `Showing ${filteredStudents.length} of ${students.length} students`),
      
      filteredStudents.length === 0 ? 
        React.createElement('div', { 
          style: { 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280' 
          }
        },
          React.createElement('div', { style: { fontSize: '48px', marginBottom: '10px' } }, '👥'),
          React.createElement('div', { style: { fontSize: '18px', marginBottom: '5px' } }, 'No students found'),
          React.createElement('div', { style: { fontSize: '14px' } }, searchTerm ? 'Try adjusting your search terms' : 'Add students to get started')
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
              gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
              gap: '15px',
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '14px',
              color: '#374151'
            }
          },
            React.createElement('div', null, 'Student Information'),
            React.createElement('div', { style: { textAlign: 'center' } }, 'Student ID'),
            React.createElement('div', { style: { textAlign: 'center' } }, 'Grade'),
            React.createElement('div', { style: { textAlign: 'center' } }, 'Contact'),
            React.createElement('div', { style: { textAlign: 'center' } }, 'Actions')
          ),
          
          // Student rows
          ...filteredStudents.map(student =>
            React.createElement('div', { 
              key: student._id,
              style: { 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
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
                  `${student.firstName} ${student.lastName}`
                ),
                React.createElement('div', { 
                  style: { 
                    fontSize: '12px', 
                    color: '#6b7280' 
                  } 
                }, student.email),
                React.createElement('div', { 
                  style: { 
                    fontSize: '11px', 
                    color: '#6b7280',
                    marginTop: '2px'
                  } 
                }, `Parents: ${student.fathersName}, ${student.mothersName}`)
              ),
              React.createElement('div', { 
                style: { 
                  textAlign: 'center',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  fontWeight: '500'
                } 
              }, student.studentID),
              React.createElement('div', { 
                style: { 
                  textAlign: 'center' 
                }
              },
                React.createElement('span', { 
                  style: { 
                    padding: '4px 8px',
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }
                }, `Grade ${student.grade}`)
              ),
              React.createElement('div', { 
                style: { 
                  fontSize: '12px', 
                  color: '#6b7280',
                  textAlign: 'center'
                } 
              },
                React.createElement('div', { style: { marginBottom: '2px' } }, student.email),
                student.address && React.createElement('div', { 
                  style: { 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '120px'
                  } 
                }, student.address)
              ),
              React.createElement('div', { 
                style: { 
                  display: 'flex', 
                  gap: '8px' 
                }
              },
                React.createElement('button', {
                  onClick: () => {
                    setEditingStudent(student);
                    setFormData({
                      studentID: student.studentID,
                      firstName: student.firstName,
                      lastName: student.lastName,
                      email: student.email,
                      grade: student.grade.toString(),
                      fathersName: student.fathersName,
                      mothersName: student.mothersName,
                      address: student.address
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
                    if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
                      try {
                        await adminAPI.deleteStudent(student._id);
                        setSuccess('Student deleted successfully!');
                        fetchStudents();
                      } catch (err: any) {
                        setError(err.response?.data?.message || 'Failed to delete student');
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

export default StudentManagement;