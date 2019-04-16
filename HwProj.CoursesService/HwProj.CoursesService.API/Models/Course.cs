﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using HwProj.Repositories;

namespace HwProj.CoursesService.API.Models
{
    public class Course : IEntity
    {
        [Key]
        public long Id { get; set; }
        
        public string Name { get; set; }
        
        public string GroupName { get; set; }
        
        public bool IsOpen { get; set; }
        
        public bool IsComplete { get; set; }
        
        public long MentorId { get; set; }

        public List<CourseMate> CourseMates { get; set; } = new List<CourseMate>();
    }
}