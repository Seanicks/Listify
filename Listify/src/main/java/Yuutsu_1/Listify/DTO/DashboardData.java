package Yuutsu_1.Listify.DTO;
 
import Yuutsu_1.Listify.Entity.TaskEntity;
import Yuutsu_1.Listify.Entity.StudentEntity;
import java.util.List;
 
public class DashboardData {
    private List<TaskEntity> tasks;
    private List<StudentEntity> students;
 
    // Constructor
    public DashboardData(List<TaskEntity> tasks, List<StudentEntity> students) {
        this.tasks = tasks;
        this.students = students;
    }
 
    // Getters and Setters
    public List<TaskEntity> getTasks() {
        return tasks;
    }
 
    public void setTasks(List<TaskEntity> tasks) {
        this.tasks = tasks;
    }
 
    public List<StudentEntity> getStudents() {
        return students;
    }
 
    public void setStudents(List<StudentEntity> students) {
        this.students = students;
    }
}
