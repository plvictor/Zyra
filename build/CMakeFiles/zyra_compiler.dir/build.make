# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.31

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:

#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:

# Disable VCS-based implicit rules.
% : %,v

# Disable VCS-based implicit rules.
% : RCS/%

# Disable VCS-based implicit rules.
% : RCS/%,v

# Disable VCS-based implicit rules.
% : SCCS/s.%

# Disable VCS-based implicit rules.
% : s.%

.SUFFIXES: .hpux_make_needs_suffix_list

# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:
.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /opt/homebrew/bin/cmake

# The command to remove a file.
RM = /opt/homebrew/bin/cmake -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /Users/paulovictor/Zyra

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Users/paulovictor/Zyra/build

# Include any dependencies generated for this target.
include CMakeFiles/zyra_compiler.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include CMakeFiles/zyra_compiler.dir/compiler_depend.make

# Include the progress variables for this target.
include CMakeFiles/zyra_compiler.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/zyra_compiler.dir/flags.make

CMakeFiles/zyra_compiler.dir/codegen:
.PHONY : CMakeFiles/zyra_compiler.dir/codegen

CMakeFiles/zyra_compiler.dir/src/compiler/lexer/lexer.cpp.o: CMakeFiles/zyra_compiler.dir/flags.make
CMakeFiles/zyra_compiler.dir/src/compiler/lexer/lexer.cpp.o: /Users/paulovictor/Zyra/src/compiler/lexer/lexer.cpp
CMakeFiles/zyra_compiler.dir/src/compiler/lexer/lexer.cpp.o: CMakeFiles/zyra_compiler.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green --progress-dir=/Users/paulovictor/Zyra/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object CMakeFiles/zyra_compiler.dir/src/compiler/lexer/lexer.cpp.o"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT CMakeFiles/zyra_compiler.dir/src/compiler/lexer/lexer.cpp.o -MF CMakeFiles/zyra_compiler.dir/src/compiler/lexer/lexer.cpp.o.d -o CMakeFiles/zyra_compiler.dir/src/compiler/lexer/lexer.cpp.o -c /Users/paulovictor/Zyra/src/compiler/lexer/lexer.cpp

CMakeFiles/zyra_compiler.dir/src/compiler/lexer/lexer.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Preprocessing CXX source to CMakeFiles/zyra_compiler.dir/src/compiler/lexer/lexer.cpp.i"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/paulovictor/Zyra/src/compiler/lexer/lexer.cpp > CMakeFiles/zyra_compiler.dir/src/compiler/lexer/lexer.cpp.i

CMakeFiles/zyra_compiler.dir/src/compiler/lexer/lexer.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Compiling CXX source to assembly CMakeFiles/zyra_compiler.dir/src/compiler/lexer/lexer.cpp.s"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/paulovictor/Zyra/src/compiler/lexer/lexer.cpp -o CMakeFiles/zyra_compiler.dir/src/compiler/lexer/lexer.cpp.s

CMakeFiles/zyra_compiler.dir/src/compiler/parser/parser.cpp.o: CMakeFiles/zyra_compiler.dir/flags.make
CMakeFiles/zyra_compiler.dir/src/compiler/parser/parser.cpp.o: /Users/paulovictor/Zyra/src/compiler/parser/parser.cpp
CMakeFiles/zyra_compiler.dir/src/compiler/parser/parser.cpp.o: CMakeFiles/zyra_compiler.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green --progress-dir=/Users/paulovictor/Zyra/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object CMakeFiles/zyra_compiler.dir/src/compiler/parser/parser.cpp.o"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT CMakeFiles/zyra_compiler.dir/src/compiler/parser/parser.cpp.o -MF CMakeFiles/zyra_compiler.dir/src/compiler/parser/parser.cpp.o.d -o CMakeFiles/zyra_compiler.dir/src/compiler/parser/parser.cpp.o -c /Users/paulovictor/Zyra/src/compiler/parser/parser.cpp

CMakeFiles/zyra_compiler.dir/src/compiler/parser/parser.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Preprocessing CXX source to CMakeFiles/zyra_compiler.dir/src/compiler/parser/parser.cpp.i"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/paulovictor/Zyra/src/compiler/parser/parser.cpp > CMakeFiles/zyra_compiler.dir/src/compiler/parser/parser.cpp.i

CMakeFiles/zyra_compiler.dir/src/compiler/parser/parser.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Compiling CXX source to assembly CMakeFiles/zyra_compiler.dir/src/compiler/parser/parser.cpp.s"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/paulovictor/Zyra/src/compiler/parser/parser.cpp -o CMakeFiles/zyra_compiler.dir/src/compiler/parser/parser.cpp.s

# Object files for target zyra_compiler
zyra_compiler_OBJECTS = \
"CMakeFiles/zyra_compiler.dir/src/compiler/lexer/lexer.cpp.o" \
"CMakeFiles/zyra_compiler.dir/src/compiler/parser/parser.cpp.o"

# External object files for target zyra_compiler
zyra_compiler_EXTERNAL_OBJECTS =

libzyra_compiler.a: CMakeFiles/zyra_compiler.dir/src/compiler/lexer/lexer.cpp.o
libzyra_compiler.a: CMakeFiles/zyra_compiler.dir/src/compiler/parser/parser.cpp.o
libzyra_compiler.a: CMakeFiles/zyra_compiler.dir/build.make
libzyra_compiler.a: CMakeFiles/zyra_compiler.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green --bold --progress-dir=/Users/paulovictor/Zyra/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Linking CXX static library libzyra_compiler.a"
	$(CMAKE_COMMAND) -P CMakeFiles/zyra_compiler.dir/cmake_clean_target.cmake
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/zyra_compiler.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/zyra_compiler.dir/build: libzyra_compiler.a
.PHONY : CMakeFiles/zyra_compiler.dir/build

CMakeFiles/zyra_compiler.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/zyra_compiler.dir/cmake_clean.cmake
.PHONY : CMakeFiles/zyra_compiler.dir/clean

CMakeFiles/zyra_compiler.dir/depend:
	cd /Users/paulovictor/Zyra/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/paulovictor/Zyra /Users/paulovictor/Zyra /Users/paulovictor/Zyra/build /Users/paulovictor/Zyra/build /Users/paulovictor/Zyra/build/CMakeFiles/zyra_compiler.dir/DependInfo.cmake "--color=$(COLOR)"
.PHONY : CMakeFiles/zyra_compiler.dir/depend

