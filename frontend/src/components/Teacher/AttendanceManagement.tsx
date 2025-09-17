import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Teacher } from '../../types';

interface Student {
  _id: string;
  studentID: string;
  firstName: string;
  lastName: string;
  grade: number;
}

interface AttendanceRecord {
  studentId: string;
  status: 'Present' | 'Absent' | 'Late';
  date: string;
  subject?: string;
}

const AttendanceManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: 'Present' | 'Absent' | 'Late' }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await teacherAPI.getStudents();
      setStudents(Array.isArray(data) ? data : data.students || []);
      
      // Initialize attendance state
      const initialAttendance: { [key: string]: 'Present' | 'Absent' | 'Late' } = {};
      (Array.isArray(data) ? data : data.students || []).forEach((student: Student) => {
        initialAttendance[student._id] = 'Present';
      });
      setAttendance(initialAttendance);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!selectedSubject.trim()) {
      setError('Please enter a subject');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const attendanceData = {
        date: selectedDate,
        subject: selectedSubject,
        records: Object.entries(attendance).map(([studentId, status]) => ({
          studentId,
          status,
          date: selectedDate,
          subject: selectedSubject
        }))
      };

      await teacherAPI.markAttendance(attendanceData);
      setSuccess(`Attendance marked successfully for ${Object.keys(attendance).length} students`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return '#10b981';
      case 'Absent': return '#ef4444';
      case 'Late': return '#f59e0b';
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
      React.createElement('h3', { style: { color: '#3b82f6', marginBottom: '20px' } }, 'Mark Attendance'),
      
      // Date and Subject inputs
      React.createElement('div', { 
        style: { 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginBottom: '20px'
        }
      },
        React.createElement('div', null,
          React.createElement('label', { 
            style: { 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '500' 
            } 
          }, 'Date'),
          React.createElement('input', {
            type: 'date',
            value: selectedDate,
            onChange: (e) => setSelectedDate(e.target.value),
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
          }, 'Subject'),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Enter subject name',
            value: selectedSubject,
            onChange: (e) => setSelectedSubject(e.target.value),
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
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }
      },
        React.createElement('h4', { style: { margin: '0' } }, 
          `Students List (${students.length})`
        ),
        React.createElement('button', {
          onClick: handleSubmitAttendance,
          disabled: submitting,
          style: {
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            opacity: submitting ? 0.7 : 1
          }
        }, submitting ? 'Submitting...' : 'Submit Attendance')
      ),
      
      students.length === 0 ? 
        React.createElement('p', { 
          style: { 
            textAlign: 'center', 
            color: '#6b7280',
            padding: '40px'
          } 
        }, 'No students found') :
        React.createElement('div', { 
          style: { 
            display: 'grid', 
            gap: '10px' 
          }
        },
          React.createElement('div', { 
            style: { 
              display: 'grid', 
              gridTemplateColumns: '1fr auto auto auto',
              gap: '10px',
              padding: '10px',
              backgroundColor: '#f9fafb',
              borderRadius: '4px',
              fontWeight: '600',
              fontSize: '14px'
            }
          },
            React.createElement('div', null, 'Student'),
            React.createElement('div', { style: { textAlign: 'center' } }, 'Present'),
            React.createElement('div', { style: { textAlign: 'center' } }, 'Late'),
            React.createElement('div', { style: { textAlign: 'center' } }, 'Absent')
          ),
          
          ...students.map(student =>
            React.createElement('div', { 
              key: student._id,
              style: { 
                display: 'grid', 
                gridTemplateColumns: '1fr auto auto auto',
                gap: '10px',
                padding: '15px',
                backgroundColor: '#fafafa',
                borderRadius: '6px',
                alignItems: 'center'
              }
            },
              React.createElement('div', null,
                React.createElement('div', { style: { fontWeight: '500' } }, 
                  `${student.firstName} ${student.lastName}`
                ),
                React.createElement('div', { 
                  style: { 
                    fontSize: '12px', 
                    color: '#6b7280' 
                  } 
                }, `ID: ${student.studentID} | Grade: ${student.grade}`)
              ),
              
              ...['Present', 'Late', 'Absent'].map(status =>
                React.createElement('label', { 
                  key: status,
                  style: { 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }
                },
                  React.createElement('input', {
                    type: 'radio',
                    name: `attendance-${student._id}`,
                    checked: attendance[student._id] === status,
                    onChange: () => handleAttendanceChange(student._id, status as 'Present' | 'Absent' | 'Late'),
                    style: {
                      accentColor: getStatusColor(status),
                      transform: 'scale(1.2)'
                    }
                  })
                )
              )
            )
          )
        )
    )
  );
};

export default AttendanceManagement;