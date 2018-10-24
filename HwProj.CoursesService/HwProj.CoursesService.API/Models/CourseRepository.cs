﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Z.EntityFramework.Plus;

namespace HwProj.CoursesService.API.Models
{
    public class CourseRepository : ICourseRepository
    {
        private readonly CourseContext _context;

        public CourseRepository(CourseContext context)
        {
            _context = context;
        }

        public IEnumerable<Course> Courses
            => _context.Courses;

        public Course Get(long id)
        {
            return _context.Courses.FirstOrDefault(course => course.Id == id);
        }

        public async Task AddAndSaveAsync(Course course)
        {
            _context.Add(course);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteByIdAndSaveAsync(long id)
        {
            var result = await _context.Courses.Where(course => course.Id == id).DeleteAsync();
            return result == 1;
        }

        public async Task<bool> ModifyAndSaveAsync(long id, CourseViewModel courseViewModel)
        {
            var course = Get(id);
            if (course == null)
            {
                return false;
            }

            course.Name = courseViewModel.Name;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}