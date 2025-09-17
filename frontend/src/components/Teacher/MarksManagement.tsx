import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/api';

interface Student {
  _id: string;
  studentID: string;
  firstName: string;
  lastName: string;
  grade: number;
}

interface Mark {
  _id?: string;
  studentId: string;
  subject: string;
  examType: string;
  marks: number;
  totalMarks: number;
  date: string;
}

const MarksManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    examType: 'Quiz',
    marks: '',
    totalMarks: '100',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const studentsData = await teacherAPI.getStudents();
      setStudents(Array.isArray(studentsData) ? studentsData : studentsData.students || []);
    } catch (err: any) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !formData.subject.trim() || !formData.marks || !formData.totalMarks) {
      setError('Please fill in all required fields');
      return;
    }

    const marksNum = parseInt(formData.marks);
    const totalMarksNum = parseInt(formData.totalMarks);
    
    if (marksNum < 0 || marksNum > totalMarksNum) {
      setError('Marks must be between 0 and total marks');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const markData = {
        studentId: selectedStudent,
        subject: formData.subject,
        examType: formData.examType,
        marks: marksNum,
        totalMarks: totalMarksNum,
        date: formData.date
      };

      await teacherAPI.addMarks(markData);
      setSuccess('Marks added successfully!');
      setFormData({
        subject: '',
        examType: 'Quiz',
        marks: '',
        totalMarks: '100',
        date: new Date().toISOString().split('T')[0]
      });
      setSelectedStudent('');
      setShowForm(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add marks');
    } finally {
      setSubmitting(false);
    }
  };

  const getGradeColor = (marks: number, total: number) => {
    const percentage = (marks / total) * 100;
    if (percentage >= 90) return '#10b981';
    if (percentage >= 80) return '#3b82f6';
    if (percentage >= 70) return '#f59e0b';
    if (percentage >= 60) return '#ef4444';
    return '#6b7280';
  };

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
        React.createElement('h3', { style: { color: '#f59e0b', margin: '0' } }, 'Marks Management'),
        React.createElement('button', {
          onClick: () => setShowForm(!showForm),
          style: {
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }
        }, showForm ? 'Cancel' : '+ Add Marks')
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

    // Add Marks Form
    showForm && React.createElement('div', { 
      style: { 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }
    },
      React.createElement('h4', { style: { marginBottom: '20px' } }, 'Add Student Marks'),
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('div', { 
          style: { 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
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
            }, 'Student *'),
            React.createElement('select', {
              value: selectedStudent,
              onChange: (e) => setSelectedStudent((e.target as HTMLSelectElement).value),
              required: true,
              style: {
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }
            },
              React.createElement('option', { value: '' }, 'Select student'),
              ...students.map(student =>
                React.createElement('option', { key: student._id, value: student._id }, 
                  `${student.firstName} ${student.lastName} (${student.studentID})`
                )
              )
            )
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
            }, 'Exam Type *'),
            React.createElement('select', {
              name: 'examType',
              value: formData.examType,
              onChange: handleInputChange,
              style: {
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }
            },
              React.createElement('option', { value: 'Quiz' }, 'Quiz'),
              React.createElement('option', { value: 'Test' }, 'Test'),
              React.createElement('option', { value: 'Assignment' }, 'Assignment'),
              React.createElement('option', { value: 'Midterm' }, 'Midterm'),
              React.createElement('option', { value: 'Final' }, 'Final Exam')
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { 
              style: { 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500' 
              } 
            }, 'Marks Obtained *'),
            React.createElement('input', {
              type: 'number',
              name: 'marks',
              placeholder: '85',
              min: '0',
              value: formData.marks,
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
            }, 'Total Marks *'),
            React.createElement('input', {
              type: 'number',
              name: 'totalMarks',
              placeholder: '100',
              min: '1',
              value: formData.totalMarks,
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
            }, 'Date *'),
            React.createElement('input', {
              type: 'date',
              name: 'date',
              value: formData.date,
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
          )
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
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1
            }
          }, submitting ? 'Adding...' : 'Add Marks')
        )
      )
    ),

    // Marks List
    React.createElement('div', { 
      style: { 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }
    },
      React.createElement('h4', { style: { marginBottom: '15px' } }, 'Recent Marks'),
      marks.length === 0 ? 
        React.createElement('div', { 
          style: { 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280' 
          }
        },
          React.createElement('div', { style: { fontSize: '48px', marginBottom: '10px' } }, '📝'),
          React.createElement('div', { style: { fontSize: '18px', marginBottom: '5px' } }, 'No marks recorded yet'),
          React.createElement('div', { style: { fontSize: '14px' } }, 'Add marks for students using the button above')
        ) :
        React.createElement('div', { 
          style: { 
            display: 'grid', 
            gap: '15px' 
          }
        },
          ...marks.map(mark => {
            const student = students.find(s => s._id === mark.studentId);
            const percentage = (mark.marks / mark.totalMarks) * 100;
            
            return React.createElement('div', { 
              key: mark._id || `${mark.studentId}-${mark.date}`,
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
                  }, student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'),
                  React.createElement('div', { 
                    style: { 
                      fontSize: '14px', 
                      color: '#6b7280',
                      marginBottom: '5px' 
                    } 
                  }, `${mark.subject} - ${mark.examType}`)
                ),
                React.createElement('div', { 
                  style: { 
                    textAlign: 'right' 
                  }
                },
                  React.createElement('div', { 
                    style: { 
                      fontSize: '20px', 
                      fontWeight: 'bold',
                      color: getGradeColor(mark.marks, mark.totalMarks),
                      marginBottom: '2px'
                    }
                  }, `${mark.marks}/${mark.totalMarks}`),
                  React.createElement('div', { 
                    style: { 
                      fontSize: '12px', 
                      color: '#6b7280'
                    } 
                  }, `${percentage.toFixed(1)}%`)
                )
              ),
              React.createElement('div', { 
                style: { 
                  fontSize: '12px', 
                  color: '#6b7280'
                }
              }, `Date: ${new Date(mark.date).toLocaleDateString()}`)
            );
          })
        )
    )
  );
};

export default MarksManagement;